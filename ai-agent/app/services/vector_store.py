
import psycopg
from pgvector import Vector
from pgvector.psycopg import register_vector

from app.config import DATABASE_URL


def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is missing in .env")

    conn = psycopg.connect(DATABASE_URL)

    try:
        register_vector(conn)
        return conn
    except Exception:
        conn.close()
        raise


def save_chunks(chunks, collection_id="bluehouse"):
    if not chunks:
        return

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.executemany(
                """
                INSERT INTO pdf_chunks (
                    document_id,
                    collection_id,
                    filename,
                    page_number,
                    chunk_index,
                    chunk_text,
                    embedding
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (document_id, chunk_index)
                DO UPDATE SET
                    collection_id = EXCLUDED.collection_id,
                    filename = EXCLUDED.filename,
                    page_number = EXCLUDED.page_number,
                    chunk_text = EXCLUDED.chunk_text,
                    embedding = EXCLUDED.embedding
                """,
                [
                    (
                        chunk["document_id"],
                        collection_id,
                        chunk["filename"],
                        chunk["page_number"],
                        chunk["chunk_index"],
                        chunk["text"],
                        Vector(chunk["embedding"]),
                    )
                    for chunk in chunks
                ],
            )


def search_chunks(question_embedding, top_k=4):
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT
                document_id,
                filename,
                page_number,
                chunk_text,
                embedding <=> %s AS distance
            FROM pdf_chunks
            WHERE collection_id = 'bluehouse'
            ORDER BY embedding <=> %s
            LIMIT %s
            """,
            (
                Vector(question_embedding),
                Vector(question_embedding),
                top_k,
            ),
        ).fetchall()

    return [
        {
            "document_id": row[0],
            "source": row[1],
            "page": row[2],
            "text": row[3],
            "distance": float(row[4]),
        }
        for row in rows
    ]
