from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.clients import router as clients_router
from routes.analyze import router as analyze_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clients_router, prefix="/api/clients")
app.include_router(analyze_router, prefix="/api/analyze")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
async def startup_event():
    from database import SessionLocal
    from models.db_models import Client
    import sys
    import os
    sys.path.insert(0, os.path.dirname(__file__))
    db = SessionLocal()
    try:
        if db.query(Client).count() == 0:
            from scripts.seed import seed_db
            seed_db()
    finally:
        db.close()
