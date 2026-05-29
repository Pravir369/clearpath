import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.db_models import Client
from models.schemas import ClientCreate, ClientOut
from typing import List

router = APIRouter()

OFFICER_ID = "demo-officer-1"


@router.get("/", response_model=List[ClientOut])
def list_clients(db: Session = Depends(get_db)):
    return db.query(Client).filter(Client.officer_id == OFFICER_ID).all()


@router.get("/{client_id}", response_model=ClientOut)
def get_client(client_id: str, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("/", response_model=ClientOut, status_code=201)
def create_client(data: ClientCreate, db: Session = Depends(get_db)):
    client = Client(
        id=str(uuid.uuid4()),
        officer_id=OFFICER_ID,
        **data.model_dump(),
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client
