import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
import psycopg
import requests
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_CSV_PATH = ROOT_DIR / 'recommender' / 'Mobiles Dataset (2025).csv'
DEFAULT_EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL_NAME', 'intfloat/multilingual-e5-large')
_LOCAL_MODEL = None

TABLET_KEYWORDS = ('ipad', 'tablet', 'tab ', ' tab', 'pad')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Seed Neon Postgres with cleaned mobile products and embeddings')
    parser.add_argument('--csv', default=str(DEFAULT_CSV_PATH), help='Path to mobile dataset CSV')
    parser.add_argument('--batch-size', type=int, default=32, help='Embedding batch size')
    parser.add_argument('--limit', type=int, default=0, help='Optional max rows to process after cleaning')
    parser.add_argument('--embedding-service-url', default=os.getenv('EMBEDDING_SERVICE_URL', ''), help='Embedding service base URL')
    parser.add_argument('--skip-embeddings', action='store_true', help='Load data without embeddings')
    return parser.parse_args()


def parse_int(value: Any) -> Optional[int]:
    if value is None:
        return None

    text = str(value).strip()
    if not text:
        return None

    digits = re.sub(r'[^0-9]', '', text)
    if not digits:
        return None

    return int(digits)


def parse_float(value: Any) -> Optional[float]:
    if value is None:
        return None

    text = str(value).strip()
    if not text:
        return None

    match = re.search(r'(\d+(?:\.\d+)?)', text)
    if not match:
        return None

    return float(match.group(1))


def parse_camera_mp(value: Any) -> Optional[float]:
    if value is None:
        return None

    text = str(value)
    mp_matches = re.findall(r'(\d+(?:\.\d+)?)\s*MP', text, flags=re.IGNORECASE)
    if mp_matches:
        return float(max(float(entry) for entry in mp_matches))

    return parse_float(text)


def is_smartphone(model_name: str) -> bool:
    lower_name = model_name.lower()
    return not any(keyword in lower_name for keyword in TABLET_KEYWORDS)


def make_product_id(brand: str, model_name: str) -> str:
    raw = f'{brand.strip().lower()}::{model_name.strip().lower()}'
    return hashlib.sha1(raw.encode('utf-8')).hexdigest()[:24]


def make_specs_text(record: Dict[str, Any]) -> str:
    parts = [
        f"{record['brand']} {record['model_name']}",
        f"Price INR {record['price_inr']}",
    ]

    if record.get('ram_gb'):
        parts.append(f"{record['ram_gb']}GB RAM")
    if record.get('battery_mah'):
        parts.append(f"{record['battery_mah']}mAh battery")
    if record.get('processor'):
        parts.append(f"Processor {record['processor']}")
    if record.get('back_camera_mp'):
        parts.append(f"Rear camera {record['back_camera_mp']}MP")
    if record.get('front_camera_mp'):
        parts.append(f"Front camera {record['front_camera_mp']}MP")
    if record.get('screen_size_inches'):
        parts.append(f"Display {record['screen_size_inches']} inches")

    return '. '.join(parts)


def make_tags(record: Dict[str, Any]) -> List[str]:
    tags = [record['brand'].lower(), 'smartphone']

    price = record.get('price_inr')
    if price is not None:
        if price <= 20000:
            tags.append('budget')
        elif price >= 70000:
            tags.append('flagship')

    if (record.get('battery_mah') or 0) >= 5000:
        tags.append('battery-focused')

    if (record.get('back_camera_mp') or 0) >= 64:
        tags.append('camera-focused')

    return sorted(set(tags))


def load_csv_frame(csv_path: Path) -> pd.DataFrame:
    errors: List[str] = []

    for encoding in ('utf-8', 'utf-8-sig', 'cp1252', 'latin-1'):
        try:
            return pd.read_csv(
                csv_path,
                encoding=encoding,
                encoding_errors='replace',
                on_bad_lines='skip',
                engine='python',
            )
        except Exception as error:
            errors.append(f'{encoding}: {error}')

    raise RuntimeError('Unable to parse CSV with supported encodings. Details: ' + ' | '.join(errors))


def clean_dataset(csv_path: Path, limit: int = 0) -> Tuple[List[Dict[str, Any]], int]:
    frame = load_csv_frame(csv_path)
    cleaned: List[Dict[str, Any]] = []
    skipped_rows = 0

    for row in frame.to_dict('records'):
        brand = str(row.get('Company Name', '')).strip()
        model_name = str(row.get('Model Name', '')).strip()

        if not brand or not model_name or not is_smartphone(model_name):
            skipped_rows += 1
            continue

        price_inr = parse_int(row.get('Launched Price (India)'))
        if not price_inr:
            skipped_rows += 1
            continue

        record = {
            'id': make_product_id(brand, model_name),
            'title': f'{brand} {model_name}'.strip(),
            'brand': brand,
            'model_name': model_name,
            'category': 'smartphone',
            'price_inr': price_inr,
            'launched_year': parse_int(row.get('Launched Year')),
            'battery_mah': parse_int(row.get('Battery Capacity')),
            'ram_gb': parse_int(row.get('RAM')),
            'screen_size_inches': parse_float(row.get('Screen Size')),
            'weight_grams': parse_float(row.get('Mobile Weight')),
            'processor': str(row.get('Processor', '')).strip() or None,
            'front_camera_mp': parse_camera_mp(row.get('Front Camera')),
            'back_camera_mp': parse_camera_mp(row.get('Back Camera')),
            'image_url': None,
            'product_url': None,
            'rating': 0,
            'reviews': 0,
        }

        record['specs_text'] = make_specs_text(record)
        record['tags'] = make_tags(record)
        cleaned.append(record)

        if limit and len(cleaned) >= limit:
            break

    return cleaned, skipped_rows


def get_local_embeddings(texts: List[str]) -> List[List[float]]:
    global _LOCAL_MODEL

    if _LOCAL_MODEL is None:
        from sentence_transformers import SentenceTransformer

        _LOCAL_MODEL = SentenceTransformer(DEFAULT_EMBEDDING_MODEL)

    model = _LOCAL_MODEL
    vectors = model.encode(texts, normalize_embeddings=True, convert_to_numpy=True, show_progress_bar=False)
    return vectors.tolist()


def get_service_embeddings(endpoint: str, texts: List[str]) -> List[List[float]]:
    response = requests.post(
        f"{endpoint.rstrip('/')}/embed",
        json={
            'inputs': [f'passage: {text}' for text in texts],
            'normalize': True,
        },
        timeout=120,
    )
    response.raise_for_status()
    payload = response.json()
    embeddings = payload.get('embeddings')

    if not isinstance(embeddings, list):
        raise ValueError('Embedding service returned invalid payload')

    return embeddings


def generate_embeddings(records: List[Dict[str, Any]], batch_size: int, endpoint: str) -> None:
    texts = [record['specs_text'] for record in records]

    all_embeddings: List[List[float]] = []
    for start in range(0, len(texts), batch_size):
        batch = texts[start : start + batch_size]

        if endpoint:
            embeddings = get_service_embeddings(endpoint, batch)
        else:
            embeddings = get_local_embeddings([f'passage: {item}' for item in batch])

        all_embeddings.extend(embeddings)

    if len(all_embeddings) != len(records):
        raise RuntimeError('Embedding count does not match record count')

    for record, embedding in zip(records, all_embeddings):
        record['embedding'] = f"[{','.join(f'{float(value):.8f}' for value in embedding)}]"


def upsert_records(database_url: str, records: List[Dict[str, Any]]) -> int:
    sql = """
    INSERT INTO products (
      id,
      title,
      brand,
      model_name,
      category,
      price_inr,
      launched_year,
      battery_mah,
      ram_gb,
      screen_size_inches,
      weight_grams,
      processor,
      front_camera_mp,
      back_camera_mp,
      specs_text,
      image_url,
      product_url,
      tags,
      rating,
      reviews,
      embedding
    )
    VALUES (
      %(id)s,
      %(title)s,
      %(brand)s,
      %(model_name)s,
      %(category)s,
      %(price_inr)s,
      %(launched_year)s,
      %(battery_mah)s,
      %(ram_gb)s,
      %(screen_size_inches)s,
      %(weight_grams)s,
      %(processor)s,
      %(front_camera_mp)s,
      %(back_camera_mp)s,
      %(specs_text)s,
      %(image_url)s,
      %(product_url)s,
      %(tags)s::jsonb,
      %(rating)s,
      %(reviews)s,
      %(embedding)s::vector
    )
    ON CONFLICT (brand, model_name)
    DO UPDATE SET
      title = EXCLUDED.title,
      category = EXCLUDED.category,
      price_inr = EXCLUDED.price_inr,
      launched_year = EXCLUDED.launched_year,
      battery_mah = EXCLUDED.battery_mah,
      ram_gb = EXCLUDED.ram_gb,
      screen_size_inches = EXCLUDED.screen_size_inches,
      weight_grams = EXCLUDED.weight_grams,
      processor = EXCLUDED.processor,
      front_camera_mp = EXCLUDED.front_camera_mp,
      back_camera_mp = EXCLUDED.back_camera_mp,
      specs_text = EXCLUDED.specs_text,
      image_url = EXCLUDED.image_url,
      product_url = EXCLUDED.product_url,
      tags = EXCLUDED.tags,
      rating = EXCLUDED.rating,
      reviews = EXCLUDED.reviews,
      embedding = EXCLUDED.embedding,
      updated_at = NOW();
    """

    payload = []
    for record in records:
        payload.append(
            {
                **record,
                'tags': json.dumps(record.get('tags', [])),
                'embedding': record.get('embedding', None),
            }
        )

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.executemany(sql, payload)
        connection.commit()

    return len(payload)


def main() -> None:
    load_dotenv(ROOT_DIR / 'server' / '.env')
    load_dotenv(ROOT_DIR / '.env')

    args = parse_args()
    csv_path = Path(args.csv).resolve()

    database_url = os.getenv('DATABASE_URL', '').strip()
    if not database_url:
        print('DATABASE_URL is required to seed Neon/Postgres.', file=sys.stderr)
        sys.exit(1)

    if not csv_path.exists():
        print(f'CSV not found at {csv_path}', file=sys.stderr)
        sys.exit(1)

    records, skipped_rows = clean_dataset(csv_path, limit=args.limit)
    if not records:
        print('No records available after cleaning. Nothing to insert.', file=sys.stderr)
        sys.exit(1)

    print(f'Loaded {len(records)} cleaned smartphone records. Skipped rows: {skipped_rows}')

    if args.skip_embeddings:
        for record in records:
            record['embedding'] = None
    else:
        try:
            generate_embeddings(records, batch_size=args.batch_size, endpoint=args.embedding_service_url)
            print('Embeddings generated successfully.')
        except Exception as error:
            print(f'Embedding generation failed: {error}', file=sys.stderr)
            sys.exit(1)

    inserted = upsert_records(database_url, records)
    print(f'Upserted {inserted} products into products table.')


if __name__ == '__main__':
    main()
