import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GO_BACKEND_URL = os.getenv("GO_BACKEND_URL")