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
