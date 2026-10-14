import requests

from app.config import GO_BACKEND_URL


def get_all_employees(jwt_token: str):
    headers = {
        "Authorization": f"Bearer {jwt_token}"
    }

    response = requests.get(
        f"{GO_BACKEND_URL}/employees",
        headers=headers,
        timeout=10,
    )

    response.raise_for_status()

    return response.json()