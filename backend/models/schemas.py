from datetime import date, datetime
from typing import List, Literal, Optional
from pydantic import BaseModel


class ClientCreate(BaseModel):
    name: str
    release_date: date
    county: str
    conviction_type: Literal["non-violent drug", "violent", "property", "other"]
    age: int
    is_veteran: bool = False
    has_dependents: bool = False


class ClientOut(BaseModel):
    id: str
    officer_id: str
    name: str
    release_date: date
    county: str
    conviction_type: str
    age: int
    is_veteran: bool
    has_dependents: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class BenefitWindow(BaseModel):
    program_name: str
    deadline_days: int
    days_remaining: int
    status: Literal["red", "yellow", "green"]
    eligible: bool


class CatchTwoStatus(BaseModel):
    has_catch_two: bool
    agency_name: Optional[str] = None
    address: Optional[str] = None
    hours: Optional[str] = None
    docs_needed: Optional[List[str]] = None


class ActionItem(BaseModel):
    priority: Literal["high", "medium", "low"]
    text: str


class ClientAnalysis(BaseModel):
    client: ClientOut
    benefits: List[BenefitWindow]
    catch_two: CatchTwoStatus
    action_items: List[ActionItem]
    intake_summary: str
    urgency: Literal["red", "yellow", "green"]
