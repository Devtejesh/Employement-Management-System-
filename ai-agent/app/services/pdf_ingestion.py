
import math
import re
import uuid
from io import BytesIO

from fastapi import UploadFile
from google import genai
from google.genai import types
from pypdf import PdfReader

from app.config import (
    GEMINI_API_KEY,
    GEMINI_EMBEDDING_MODEL,
    EMBEDDING_DIMENSIONS,
)
from app.services.vector_store import save_chunks


MAX_FILE_SIZE = 50 * 1024 * 1024
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 200


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is missing")

    client = genai.Client(api_key=GEMINI_API_KEY)
    vectors = []

    for start in range(0, len(texts), 16):
        batch = texts[start:start + 16]

        result = client.models.embed_content(
            model=GEMINI_EMBEDDING_MODEL,
            contents=batch,
            config=types.EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT",
                output_dimensionality=EMBEDDING_DIMENSIONS,
            ),
        )

        if not result.embeddings or len(result.embeddings) != len(batch):
            raise RuntimeError("Incomplete embedding response")

        for item in result.embeddings:
            values = list(item.values)
            norm = math.sqrt(sum(value * value for value in values))

            if norm == 0:
                raise RuntimeError("Invalid zero embedding")

            vectors.append([value / norm for value in values])

    return vectors


def process_uploaded_pdfs(uploaded_files: list[UploadFile]):
    if not uploaded_files:
        raise ValueError("Please upload at least one PDF")

    chunks = []
    uploaded_documents = []

    for uploaded_file in uploaded_files:
        filename = uploaded_file.filename or "document.pdf"

        if not filename.lower().endswith(".pdf"):
            raise ValueError(f"{filename} is not a PDF")

        content = uploaded_file.file.read()

        if len(content) > MAX_FILE_SIZE:
            raise ValueError(f"{filename} exceeds the 50 MB limit")

        if not content:
            raise ValueError(f"{filename} is empty")

        document_id = str(uuid.uuid4())
        reader = PdfReader(BytesIO(content))
        chunk_index = 0

        for page_number, page in enumerate(reader.pages, start=1):
            page_text = re.sub(
                r"\s+",
                " ",
                page.extract_text() or "",
            ).strip()

            start = 0

            while start < len(page_text):
                end = min(start + CHUNK_SIZE, len(page_text))
                chunk_text = page_text[start:end].strip()

                if chunk_text:
                    chunks.append({
                        "document_id": document_id,
                        "filename": filename,
                        "page_number": page_number,
                        "chunk_index": chunk_index,
                        "text": chunk_text,
                    })
                    chunk_index += 1

                if end == len(page_text):
                    break

                start = end - CHUNK_OVERLAP

        uploaded_documents.append({
            "document_id": document_id,
            "filename": filename,
        })

    if not chunks:
        raise ValueError("No readable text found in uploaded PDFs")

    vectors = embed_texts([chunk["text"] for chunk in chunks])

    for chunk, vector in zip(chunks, vectors):
        chunk["embedding"] = vector

    save_chunks(chunks, collection_id="bluehouse")

    return {
        "message": "PDF processing completed",
        "documents": uploaded_documents,
        "chunks_saved": len(chunks),
    }
