from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.schemas import ClientAnalysis
from services.benefits_service import analyze_client

router = APIRouter()


@router.post("/{client_id}", response_model=ClientAnalysis)
def run_analysis(client_id: str, db: Session = Depends(get_db)):
    return analyze_client(client_id, db)
