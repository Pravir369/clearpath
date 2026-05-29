from sqlalchemy import Boolean, Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from database import Base


class Officer(Base):
    __tablename__ = "officers"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    google_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    clients = relationship("Client", back_populates="officer")


class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True)
    officer_id = Column(String, ForeignKey("officers.id"), nullable=False)
    name = Column(String, nullable=False)
    release_date = Column(Date, nullable=False)
    county = Column(String, nullable=False)
    conviction_type = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    is_veteran = Column(Boolean, default=False, nullable=False)
    has_dependents = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    officer = relationship("Officer", back_populates="clients")
    completions = relationship("ActionItemCompletion", back_populates="client")


class ActionItemCompletion(Base):
    __tablename__ = "action_item_completions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"), nullable=False)
    action_text = Column(String, nullable=False)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    officer_note = Column(String, nullable=True)

    client = relationship("Client", back_populates="completions")
