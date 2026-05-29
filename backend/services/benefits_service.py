import json
import os
from datetime import date
from typing import List
from models.schemas import BenefitWindow

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def _load_programs():
    with open(os.path.join(DATA_DIR, "benefits_programs.json")) as f:
        return json.load(f)


def get_eligible_benefits(client) -> List[BenefitWindow]:
    programs = _load_programs()
    results = []
    today = date.today()
    days_elapsed = (today - client.release_date).days
    for p in programs:
        if client.conviction_type not in p["eligible_convictions"]:
            continue
        if p["veterans_only"] and not client.is_veteran:
            continue
        days_remaining = max(0, p["deadline_days"] - days_elapsed)
        if days_remaining <= 7:
            status = "red"
        elif days_remaining <= 14:
            status = "yellow"
        else:
            status = "green"
        results.append(BenefitWindow(
            program_name=p["name"],
            deadline_days=p["deadline_days"],
            days_remaining=days_remaining,
            status=status,
            eligible=True,
        ))
    return results


def build_client_summary(client, benefits: List[BenefitWindow]) -> dict:
    today = date.today()
    days_since_release = (today - client.release_date).days
    most_urgent = min(benefits, key=lambda b: b.days_remaining, default=None)
    return {
        "name": client.name,
        "release_date": str(client.release_date),
        "county": client.county,
        "conviction_type": client.conviction_type,
        "days_since_release": days_since_release,
        "eligible_program_count": len(benefits),
        "most_urgent_deadline": most_urgent.days_remaining if most_urgent else None,
    }


def _compute_urgency(benefits: List[BenefitWindow], days_since_release: int) -> str:
    if days_since_release <= 3:
        return "red"
    min_days = min((b.days_remaining for b in benefits), default=999)
    if min_days <= 7:
        return "red"
    if days_since_release <= 14 or min_days <= 14:
        return "yellow"
    return "green"


def analyze_client_no_ai(client, db) -> dict:
    from services.deadline_service import get_catch_two_status
    benefits = get_eligible_benefits(client)
    summary = build_client_summary(client, benefits)
    catch_two = get_catch_two_status(client)
    urgency = _compute_urgency(benefits, summary["days_since_release"])
    return {
        "client": client,
        "benefits": benefits,
        "catch_two": catch_two,
        "summary": summary,
        "urgency": urgency,
    }


import json as _json
import os as _os


def generate_intake_analysis(client, benefits: List[BenefitWindow], catch_two) -> dict:
    prompt_path = _os.path.join(_os.path.dirname(__file__), "..", "prompts", "intake_analysis.txt")
    with open(prompt_path) as f:
        system_prompt = f.read()

    benefits_text = "\n".join(
        f"- {b.program_name}: {b.days_remaining} days remaining (status: {b.status})"
        for b in benefits
    )
    catch_two_text = (
        f"Catch-22 detected: client needs ID to get address, needs address to get ID. "
        f"Agency: {catch_two.agency_name}, {catch_two.address}"
        if catch_two.has_catch_two else "No catch-22 situation."
    )
    from datetime import date as _d
    days_since = (_d.today() - client.release_date).days

    user_message = f"""Client: {client.name}
Released: {days_since} days ago ({client.release_date})
County: {client.county}
Conviction type: {client.conviction_type}
Age: {client.age}
Veteran: {client.is_veteran}
Has dependents: {client.has_dependents}

Eligible benefits:
{benefits_text}

{catch_two_text}"""

    from services.groq_service import call_groq
    try:
        raw = call_groq(system_prompt, user_message)
        # strip markdown code fences if present
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1].rsplit("```", 1)[0]
        return _json.loads(raw)
    except Exception:
        return {
            "action_items": [
                {"priority": "high", "text": "Review benefit deadlines with client this week."},
                {"priority": "medium", "text": "Confirm all required documents are obtained."},
                {"priority": "low", "text": "Schedule follow-up appointment within 7 days."},
            ],
            "intake_summary": f"{client.name} was released {days_since} days ago. {len(benefits)} benefit programs are available — review deadlines at next meeting.",
        }


from fastapi import HTTPException
from models.schemas import ClientAnalysis, ClientOut


def analyze_client(client_id: str, db) -> ClientAnalysis:
    from models.db_models import Client as ClientModel
    from services.deadline_service import get_catch_two_status

    client = db.query(ClientModel).filter(ClientModel.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    benefits = get_eligible_benefits(client)
    catch_two = get_catch_two_status(client)
    ai_result = generate_intake_analysis(client, benefits, catch_two)

    summary = build_client_summary(client, benefits)
    urgency = _compute_urgency(benefits, summary["days_since_release"])

    return ClientAnalysis(
        client=ClientOut.model_validate(client),
        benefits=benefits,
        catch_two=catch_two,
        action_items=ai_result["action_items"],
        intake_summary=ai_result["intake_summary"],
        urgency=urgency,
    )
