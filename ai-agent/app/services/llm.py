
from google import genai

from app.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def generate_response(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
        )

        if not response.text:
            raise ValueError("Gemini returned an empty response")

        return response.text.strip()

    except Exception as error:
        print(f"Gemini API Error: {error}")
        raise
