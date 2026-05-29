#!/usr/bin/env python3
"""Test that all service modules can be imported without errors."""

import sys
import os

# Ensure backend is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Testing service imports...")

try:
    from services.benefits_service import (
        get_eligible_benefits,
        build_client_summary,
        generate_intake_analysis,
        analyze_client,
        analyze_client_no_ai,
    )
    print("✓ benefits_service imports OK")
except Exception as e:
    print(f"✗ benefits_service import failed: {e}")
    sys.exit(1)

try:
    from services.deadline_service import get_catch_two_status
    print("✓ deadline_service imports OK")
except Exception as e:
    print(f"✗ deadline_service import failed: {e}")
    sys.exit(1)

try:
    from services.groq_service import call_groq
    print("✓ groq_service imports OK")
except Exception as e:
    print(f"✗ groq_service import failed: {e}")
    sys.exit(1)

try:
    from models.schemas import (
        BenefitWindow,
        CatchTwoStatus,
        ActionItem,
        ClientAnalysis,
        ClientOut,
        ClientCreate,
    )
    print("✓ schemas imports OK")
except Exception as e:
    print(f"✗ schemas import failed: {e}")
    sys.exit(1)

try:
    from models.db_models import Officer, Client
    print("✓ db_models imports OK")
except Exception as e:
    print(f"✗ db_models import failed: {e}")
    sys.exit(1)

try:
    from database import SessionLocal, engine, Base, get_db
    print("✓ database imports OK")
except Exception as e:
    print(f"✗ database import failed: {e}")
    sys.exit(1)

print("\n✓ All imports successful!")
