from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
from models.schemas import ClientAnalysis
from models.db_models import ActionItemCompletion, Client
from services.benefits_service import analyze_client
import uuid
from datetime import datetime, timezone

router = APIRouter()


class CompleteActionRequest(BaseModel):
    action_text: str
    officer_note: str = None


class CompletionResponse(BaseModel):
    id: str
    action_text: str
    completed_at: datetime
    officer_note: str = None


@router.post("/{client_id}", response_model=ClientAnalysis)
def run_analysis(client_id: str, db: Session = Depends(get_db)):
    return analyze_client(client_id, db)


@router.post("/{client_id}/complete-action", response_model=dict)
def complete_action(client_id: str, data: CompleteActionRequest, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    completion = ActionItemCompletion(
        id=str(uuid.uuid4()),
        client_id=client_id,
        action_text=data.action_text,
        officer_note=data.officer_note,
    )
    db.add(completion)
    db.commit()
    return {"success": True}


@router.get("/{client_id}/completions", response_model=List[CompletionResponse])
def get_completions(client_id: str, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    completions = db.query(ActionItemCompletion).filter(
        ActionItemCompletion.client_id == client_id
    ).order_by(ActionItemCompletion.completed_at.desc()).all()

    return completions


@router.post("/{client_id}/regenerate", response_model=ClientAnalysis)
def regenerate_analysis(client_id: str, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    return analyze_client(client_id, db)
