
import os
from dotenv import load_dotenv

load_dotenv()

# Existing AI Agent configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GO_BACKEND_URL = os.getenv("GO_BACKEND_URL")


# DocuMind RAG configuration
DATABASE_URL = os.getenv("DATABASE_URL")
UPLOAD_SERVICE_KEY = os.getenv("UPLOAD_SERVICE_KEY", "")

GEMINI_EMBEDDING_MODEL = os.getenv(
    "GEMINI_EMBEDDING_MODEL",
    "gemini-embedding-001",
)

EMBEDDING_DIMENSIONS = int(
    os.getenv("EMBEDDING_DIMENSIONS", "768")
)
