
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.routes.pdf_upload import router as pdf_upload_router
from app.agent.graph import agent_graph


app = FastAPI()
app.include_router(pdf_upload_router)

# Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
