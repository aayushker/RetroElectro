CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'smartphone',
  price_inr INTEGER NOT NULL,
  launched_year INTEGER,
  battery_mah INTEGER,
  ram_gb INTEGER,
  screen_size_inches DOUBLE PRECISION,
  weight_grams DOUBLE PRECISION,
  processor TEXT,
  front_camera_mp DOUBLE PRECISION,
  back_camera_mp DOUBLE PRECISION,
  specs_text TEXT,
  image_url TEXT,
  product_url TEXT,
  tags JSONB,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  embedding VECTOR(1024),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT products_brand_model_key UNIQUE (brand, model_name)
);

CREATE TABLE IF NOT EXISTS query_logs (
  id TEXT PRIMARY KEY,
  raw_query TEXT NOT NULL,
  parsed_query JSONB,
  top_k INTEGER NOT NULL DEFAULT 5,
  budget_inr INTEGER,
  matched_products JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_price_inr ON products (price_inr);
CREATE INDEX IF NOT EXISTS idx_products_battery_mah ON products (battery_mah);
CREATE INDEX IF NOT EXISTS idx_products_launched_year ON products (launched_year);
CREATE INDEX IF NOT EXISTS idx_query_logs_created_at ON query_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_products_embedding
  ON products
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE OR REPLACE FUNCTION set_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at_trigger ON products;
CREATE TRIGGER products_updated_at_trigger
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_products_updated_at();
