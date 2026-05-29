import sys
import os
import json
import uuid
from datetime import date, timedelta

# Ensure backend/ is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine
from models.db_models import Base, Officer, Client

# Create tables if they don't exist yet
Base.metadata.create_all(bind=engine)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def seed_db():
    db = SessionLocal()
    try:
        # Create demo officer if not exists
        officer = db.query(Officer).filter(Officer.id == "demo-officer-1").first()
        if not officer:
            officer = Officer(
                id="demo-officer-1",
                email="demo@clearpath.dev",
                name="Demo Officer",
                google_id=None,
            )
            db.add(officer)
            db.commit()

        # Load seed clients
        seed_path = os.path.join(DATA_DIR, "seed_clients.json")
        with open(seed_path) as f:
            clients_data = json.load(f)

        for c in clients_data:
            client_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, c["name"]))
            existing = db.query(Client).filter(Client.id == client_id).first()
            if existing:
                continue
            release_date = date.today() - timedelta(days=c["days_ago"])
            client = Client(
                id=client_id,
                officer_id="demo-officer-1",
                name=c["name"],
                release_date=release_date,
                county=c["county"],
                conviction_type=c["conviction_type"],
                age=c["age"],
                is_veteran=c["is_veteran"],
                has_dependents=c["has_dependents"],
            )
            db.add(client)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
    print("Seeded successfully")
