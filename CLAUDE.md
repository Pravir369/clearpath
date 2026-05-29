# ClearPath — Claude Code Master Context
# READ THIS ENTIRE FILE BEFORE DOING ANYTHING.
# This file is your complete instructions for every session.

---

## CURRENT TASK
**Stages 1-7 Complete — Ready for Demo**
All skeleton, database, core logic, AI layer, API routes, frontend, and polish done. Stage 8 (Google Auth) not started.

---

## YOUR RULES — ALWAYS FOLLOW THESE
1. Complete ONLY the current task listed in CURRENT TASK above
2. Do NOT modify files outside the scope of the current task
3. Do NOT add features not mentioned in the current task
4. After completing the task, tell me: (a) what files you changed, (b) the exact command to verify it works
5. If you hit an error you cannot resolve in 2 attempts, STOP and explain what is blocking you
6. Never proceed to the next task without explicit instruction from me
7. Never add behavioral assessment fields (risk_score, prediction, behavior, location, danger) to any database model — ever

---

## PROJECT SUMMARY
ClearPath is an AI-powered dashboard for parole officers — not for formerly incarcerated people. It automatically maps which benefit programs each client qualifies for, tracks 30-day application windows, flags the ID/address catch-22, and uses Groq AI to generate action items and intake summaries for weekly meetings. It NEVER scores, predicts, or surveils clients — it only tracks what the SYSTEM owes the client.

---

## TECH STACK
- Backend: Python 3.11 + FastAPI
- Database: SQLite + SQLAlchemy + Alembic
- AI: Groq API — llama-3.3-70b-versatile (OpenAI-compatible SDK)
- Frontend: React 18 + Vite + Tailwind CSS + React Router v6
- Auth: Google OAuth + JWT — Stage 8 ONLY, not yet

---

## PROJECT STRUCTURE
```
clearpath/
├── CLAUDE.md                            ← YOU ARE HERE
├── .env                                 ← never commit
├── .env.example
├── .gitignore
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/versions/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── db_models.py                 ← SQLAlchemy ORM tables
│   │   └── schemas.py                   ← Pydantic request/response shapes
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── clients.py
│   │   ├── analyze.py
│   │   └── auth.py                      ← Stage 8 only
│   ├── services/
│   │   ├── __init__.py
│   │   ├── groq_service.py
│   │   ├── benefits_service.py
│   │   └── deadline_service.py
│   ├── prompts/
│   │   └── intake_analysis.txt          ← Groq system prompt lives here
│   └── data/
│       ├── seed_clients.json
│       └── benefits_programs.json
└── frontend/
    └── src/
        ├── App.jsx
        ├── lib/api.js
        ├── hooks/useClients.js
        ├── components/
        │   ├── Layout.jsx
        │   ├── ClientCard.jsx
        │   ├── DeadlineBadge.jsx
        │   ├── BenefitsPanel.jsx
        │   ├── ActionItems.jsx
        │   └── CatchTwoAlert.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── ClientDetail.jsx
            └── Login.jsx
```

---

## DATABASE SCHEMA
### Table: officers
- id: String (UUID, primary key)
- email: String (unique)
- name: String
- google_id: String (nullable — populated in Stage 8)
- created_at: DateTime

### Table: clients
- id: String (UUID, primary key)
- officer_id: String (FK → officers.id)
- name: String
- release_date: Date
- county: String (e.g. "Fulton County, GA")
- conviction_type: String ("non-violent drug" / "violent" / "property" / "other")
- age: Integer
- is_veteran: Boolean (default False)
- has_dependents: Boolean (default False)
- created_at: DateTime
- ⛔ NO risk_score, behavior, location, prediction, or any behavioral field — EVER

---

## ENVIRONMENT VARIABLES (.env)
```
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=sqlite:///./clearpath.db
JWT_SECRET=your_random_secret
VITE_API_URL=http://localhost:8000/api
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## CRITICAL CONSTRAINTS — NEVER VIOLATE
1. ⛔ DB schema: NO behavioral fields (risk_score, prediction, behavior, location, danger)
2. ⛔ Groq prompt: NEVER ask model to assess risk or predict behavior
3. ⛔ Routes: Use officer_id="demo-officer-1" hardcoded until Stage 8
4. ⛔ Prompts: Live in backend/prompts/ as .txt files — never hardcode in Python
5. ⛔ Pages: All pages except Login.jsx must use Layout.jsx wrapper
6. ⛔ Auth: Do NOT implement any auth until Stage 8

---

## DEMO SCRIPT (what the app must do)
1. Officer sees dashboard with 5 clients sorted red → yellow → green
2. Clicks Marcus Johnson (released 8 days ago, RED urgency)
3. Client detail shows:
   - Orange catch-22 banner with Fulton County DFCS address
   - 3 AI-generated action items for this week
   - Benefits panel: SNAP red, Medicaid yellow, WIOA green
   - 2-sentence AI intake summary
4. Officer adds new client → analysis generates in under 10 seconds

---

## SEED DATA
### 5 Demo Clients (Fulton County, GA)
- Marcus Johnson: released 8 days ago, non-violent drug, age 34, has dependents → RED
- Darnell Washington: released 19 days ago, property, age 28, veteran → YELLOW
- Teresa Reyes: released 30 days ago, non-violent drug, age 41, has dependents → YELLOW
- James Okafor: released 1 day ago, other, age 52 → RED
- Calvin Brooks: released 14 days ago, property, age 23 → YELLOW

### 6 Benefit Programs
- SNAP: 30 day window, non-violent/property/other convictions
- Georgia Medicaid: 30 day window, all convictions
- WIOA Workforce Training: 30 day window, all convictions
- VA Reentry Benefits: 60 day window, veterans only
- GA DHS Reentry Housing: 14 day window, non-violent/property/other
- GA Legal Services: 90 day window, non-violent/property/other

### Catch-22 Agency (Fulton County)
- Name: Fulton County DFCS — ID Without Address Program
- Address: 40 Marietta St NW, Atlanta, GA 30303
- Hours: Monday–Friday 8:00 AM – 4:00 PM
- Docs needed: Release paperwork, SSN card, birth certificate, shelter letter

---

## ALL TASKS BY STAGE

### STAGE 1 — SKELETON
- [x] F-1: Create project folder structure ✅
- [x] F-2: Write main.py + stub routes ✅
- [x] F-3: Write requirements.txt and .env files ✅
- [x] F-4: Initialize React + Vite + Tailwind ✅
- [x] F-5: Write frontend/src/lib/api.js fetch helpers ✅
- [x] F-6: Confirm frontend calls backend /health successfully ✅
- [x] F-7: Set up .gitignore and commit to GitHub ✅

### STAGE 2 — DATABASE
- [x] DB-1: Write database.py (SQLAlchemy engine + session + get_db) ✅
- [x] DB-2: Write db_models.py (Officer + Client ORM tables, NO behavioral fields) ✅
- [x] DB-3: Init Alembic, generate migration, run alembic upgrade head ✅
- [x] DB-4: Write Pydantic schemas (Client, BenefitWindow, CatchTwoStatus, ActionItem, ClientAnalysis) ✅
- [x] DB-5: Create seed_clients.json and benefits_programs.json ✅
- [x] DB-6: Write scripts/seed.py with dynamic dates ✅

### STAGE 3 — CORE LOGIC
- [x] CORE-1: Write get_eligible_benefits(client) in benefits_service.py ✅
- [x] CORE-2: Write build_client_summary(client, benefits) in benefits_service.py ✅
- [x] CORE-3: Write get_catch_two_status(client) in deadline_service.py ✅
- [x] CORE-4: Write analyze_client_no_ai(client) orchestrator ✅
- [x] CORE-5: Manual end-to-end test in Python shell ✅

### STAGE 4 — AI LAYER
- [x] AI-1: Write groq_service.py wrapper ✅
- [x] AI-2: Write backend/prompts/intake_analysis.txt system prompt ✅
- [x] AI-3: Write generate_intake_analysis() in benefits_service.py ✅
- [x] AI-4: Write full analyze_client(client_id, db) orchestrator ✅
- [x] AI-5: End-to-end AI test in Python shell ✅

### STAGE 5 — API ROUTES
- [x] API-1: Write routes/clients.py (GET list, GET detail, POST create) ✅
- [x] API-2: Write routes/analyze.py (POST analyze/{id}) ✅
- [x] API-3: Mount both routers in main.py ✅
- [x] API-4: Smoke test all endpoints via curl ✅

### STAGE 6 — FRONTEND
- [x] UI-1: Set up React Router in App.jsx ✅
- [x] UI-2: Build Layout.jsx with navbar ✅
- [x] UI-3: Build DeadlineBadge.jsx component ✅
- [x] UI-4: Build CatchTwoAlert.jsx component ✅
- [x] UI-5: Build BenefitsPanel.jsx component ✅
- [x] UI-6: Build ActionItems.jsx component ✅
- [x] UI-7: Build ClientCard.jsx component ✅
- [x] UI-8: Build Dashboard.jsx page ✅
- [x] UI-9: Build ClientDetail.jsx page ✅
- [x] UI-10: Build Login.jsx stub ✅

### STAGE 7 — DEMO POLISH
- [x] POLISH-1: Dynamic release dates in seed script ✅
- [x] POLISH-2: Pre-warm Marcus Johnson analysis on startup ✅
- [x] POLISH-3: Loading skeleton on ClientDetail ✅
- [x] POLISH-4: Demo context banner on Dashboard ✅
- [x] POLISH-5: Error boundaries on both pages ✅
- [ ] POLISH-6: 3 clean demo runs (manual task)

### STAGE 8 — GOOGLE AUTH (LAST)
- [ ] AUTH-1: Install auth dependencies
- [ ] AUTH-2: Write routes/auth.py (Google verify + JWT)
- [ ] AUTH-3: Protect API routes with JWT dependency
- [ ] AUTH-4: Wire Google login in frontend
- [ ] AUTH-5: Replace hardcoded officer name with real JWT name

---

## HOW TO UPDATE THIS FILE
After each completed task:
1. Change [ ] to [x] on the completed task
2. Update CURRENT TASK section at the top with the next task
3. Save the file
4. Run: git add CLAUDE.md && git commit -m "Updated CLAUDE.md: completed [task id]"

That's it. Claude Code reads this automatically every session.
