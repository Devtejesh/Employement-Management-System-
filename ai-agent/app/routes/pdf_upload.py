
import hmac

from fastapi import APIRouter, File, Header, HTTPException, UploadFile

from app.config import UPLOAD_SERVICE_KEY
from app.services.pdf_ingestion import process_uploaded_pdfs

router = APIRouter()


@router.post("/internal/knowledge/upload")
def upload_knowledge_pdfs(
    files: list[UploadFile] = File(...),
    x_upload_service_key: str | None = Header(default=None),
):
    if not UPLOAD_SERVICE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Upload service key is not configured",
        )

    if not x_upload_service_key or not hmac.compare_digest(
        x_upload_service_key,
        UPLOAD_SERVICE_KEY,
    ):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized upload request",
        )

    try:
        return process_uploaded_pdfs(files)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="PDF processing failed",
        ) from exc

    finally:
        for uploaded_file in files:
            uploaded_file.file.close()
