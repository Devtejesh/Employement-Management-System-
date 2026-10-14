from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from app.agent.graph import agent_graph


app = FastAPI()


class ChatRequest(BaseModel):
    message: str


@app.post("/agent/chat")
def chat(
    request: ChatRequest,
    authorization: str | None = Header(default=None),
):
    jwt_token = None

    if authorization:
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
                detail="Invalid Authorization header",
            )

        jwt_token = authorization.removeprefix("Bearer ").strip()

    result = agent_graph.invoke(
        {
            "user_message": request.message,
            "jwt_token": jwt_token,
        }
    )

    return {
        "response": result.get("final_response")
    }