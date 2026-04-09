import os
from time import perf_counter
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    from .embedder import encode_texts, get_model
except ImportError:
    from embedder import encode_texts, get_model


app = FastAPI(title='RetroElectro Embedding Service', version='1.0.0')
MODEL_NAME = os.getenv('EMBEDDING_MODEL_NAME', 'intfloat/multilingual-e5-large')


class EmbedRequest(BaseModel):
    inputs: List[str] = Field(..., min_length=1, max_length=256)
    normalize: bool = True


class EmbedResponse(BaseModel):
    model: str
    dimension: int
    elapsed_ms: int
    embeddings: List[List[float]]


@app.get('/health')
def health() -> dict:
    model = get_model()
    return {
        'status': 'ok',
        'model': MODEL_NAME,
        'dimension': model.get_sentence_embedding_dimension(),
    }


@app.post('/embed', response_model=EmbedResponse)
def embed(payload: EmbedRequest) -> EmbedResponse:
    inputs = [text.strip() for text in payload.inputs if text and text.strip()]
    if not inputs:
        raise HTTPException(status_code=400, detail='inputs must contain non-empty strings')

    start = perf_counter()
    embeddings = encode_texts(inputs, normalize=payload.normalize)
    elapsed_ms = int((perf_counter() - start) * 1000)

    model = get_model()
    return EmbedResponse(
        model=MODEL_NAME,
        dimension=model.get_sentence_embedding_dimension(),
        elapsed_ms=elapsed_ms,
        embeddings=embeddings,
    )
