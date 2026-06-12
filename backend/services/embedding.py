"""OpenAI embedding service with batching support."""
import asyncio
from typing import List
from openai import AsyncOpenAI
from config import get_settings
import structlog

logger = structlog.get_logger()
settings = get_settings()

_client: AsyncOpenAI | None = None


def get_openai_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client


async def embed_texts(texts: List[str], batch_size: int = 100) -> List[List[float]]:
    """Generate embeddings for a list of texts with batching."""
    if not texts:
        return []

    client = get_openai_client()
    all_embeddings: List[List[float]] = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        # Clean texts
        batch = [t.replace("\n", " ").strip() for t in batch if t.strip()]

        try:
            response = await client.embeddings.create(
                model=settings.openai_embedding_model,
                input=batch,
            )
            batch_embeddings = [item.embedding for item in response.data]
            all_embeddings.extend(batch_embeddings)
            logger.info(
                "Embedded batch",
                batch_num=i // batch_size + 1,
                count=len(batch),
            )
        except Exception as e:
            logger.error("Embedding failed", error=str(e), batch_start=i)
            raise

        # Small delay between batches to respect rate limits
        if i + batch_size < len(texts):
            await asyncio.sleep(0.1)

    return all_embeddings


async def embed_query(text: str) -> List[float]:
    """Embed a single query string."""
    embeddings = await embed_texts([text])
    if embeddings:
        return embeddings[0]
    raise ValueError("Failed to generate query embedding")
