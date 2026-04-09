import os
import logging
from functools import lru_cache
from typing import List

import torch
from sentence_transformers import SentenceTransformer


DEFAULT_MODEL_NAME = os.getenv('EMBEDDING_MODEL_NAME', 'intfloat/multilingual-e5-large')
DEFAULT_DEVICE = os.getenv('EMBEDDING_DEVICE', 'auto').strip().lower()
LOGGER = logging.getLogger(__name__)


def _resolve_devices() -> List[str]:
    requested = os.getenv('EMBEDDING_DEVICE', DEFAULT_DEVICE).strip().lower()
    if requested in {'', 'auto'}:
        return ['cuda', 'cpu'] if torch.cuda.is_available() else ['cpu']
    # Always keep CPU as a fallback for robustness.
    return [requested, 'cpu'] if requested != 'cpu' else ['cpu']


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    model_name = os.getenv('EMBEDDING_MODEL_NAME', DEFAULT_MODEL_NAME)
    devices = _resolve_devices()
    last_error: Exception | None = None

    for device in devices:
        try:
            model = SentenceTransformer(model_name, device=device)
            LOGGER.info("Loaded embedding model '%s' on device '%s'", model_name, device)
            return model
        except Exception as exc:  # pragma: no cover - environment dependent
            last_error = exc
            LOGGER.warning(
                "Failed to load embedding model '%s' on device '%s': %s",
                model_name,
                device,
                exc,
            )
            if device.startswith('cuda') and torch.cuda.is_available():
                torch.cuda.empty_cache()

    raise RuntimeError(
        f"Unable to load embedding model '{model_name}' on devices: {', '.join(devices)}"
    ) from last_error


def encode_texts(inputs: List[str], normalize: bool = True) -> List[List[float]]:
    model = get_model()
    vectors = model.encode(
        inputs,
        normalize_embeddings=normalize,
        convert_to_numpy=True,
        show_progress_bar=False,
    )
    return vectors.tolist()
