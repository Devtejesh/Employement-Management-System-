
import math

from google import genai
from google.genai import types

from app.config import (
    GEMINI_API_KEY,
    GEMINI_EMBEDDING_MODEL,
    EMBEDDING_DIMENSIONS,
)
from app.services.vector_store import search_chunks


def embed_question(question: str):
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is missing")

    client = genai.Client(api_key=GEMINI_API_KEY)

    result = client.models.embed_content(
        model=GEMINI_EMBEDDING_MODEL,
        contents=question,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=EMBEDDING_DIMENSIONS,
        ),
    )

    if not result.embeddings:
        raise RuntimeError("Question embedding failed")

    values = list(result.embeddings[0].values)

    norm = math.sqrt(sum(value * value for value in values))

    if norm == 0:
        raise RuntimeError("Invalid zero embedding")

    return [value / norm for value in values]


def retrieve_context(question: str, top_k: int = 4):
    question_embedding = embed_question(question)

    chunks = search_chunks(
        question_embedding,
        top_k=top_k,
    )

    if not chunks:
        return ""

    context_parts = []

    for chunk in chunks:
        context_parts.append(
            f"Source: {chunk['source']}\n"
            f"Page: {chunk['page']}\n"
            f"Content: {chunk['text']}"
        )

    return "\n\n".join(context_parts)
