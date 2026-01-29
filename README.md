# AI Incident Triage System

An end-to-end, asynchronous incident triage platform that uses a local LLM for optional enrichment. This repository demonstrates production-style backend patterns — not a chatbot or a thin API wrapper. It shows how AI can fit as one stage in a robust system rather than being a single point of failure.

## Overview

The system accepts incident reports, validates and persists them, enqueues background work, processes jobs with workers, optionally enriches incidents using a local LLM (Phi-3 via Ollama), and surfaces results to a frontend. Each component has a single responsibility and the system is designed to remain functional even when the AI runtime is unavailable.

Key architectural principles:
- Separation of control plane and worker plane
- Background job processing
- Persistent storage as source of truth
- Fault-tolerant processing and graceful degradation
- Minimal, intentional authentication for internal tooling

## What this project demonstrates

- Full-stack system design
- Asynchronous job processing with Redis + BullMQ
- PostgreSQL as the canonical data store
- Worker service architecture
- Local LLM inference (no cloud dependency)
- Graceful handling when AI is unavailable
- Simple API-key-based authentication
- Frontend polling and live updates

## High-level architecture

Browser (React)
  ↓
Backend API (Express)
  ├─ PostgreSQL (source of truth)
  └─ Redis Queue → Worker Service → Ollama (Phi-3 Mini)

Control plane:
- Frontend
- Backend API

Data / worker plane:
- PostgreSQL
- Redis + BullMQ
- Worker
- Ollama

## Tech stack

- Frontend: React + Vite  
- Backend API: Node.js + Express  
- Worker: Node.js  
- Queue: Redis + BullMQ  
- Database: PostgreSQL  
- Model: Phi-3 Mini  
- LLM runtime: Ollama  
- Auth: API key  
- Infra: Docker / docker-compose

## Core flow

1. User submits an incident.
2. Backend validates and stores the incident in PostgreSQL.
3. Backend enqueues a processing job in Redis.
4. Worker picks up the job, optionally calls Ollama for triage/enrichment.
5. Worker updates the database with results or failure state.
6. Frontend polls the API and displays status updates.

Failure modes:
- If the worker dies, incidents remain stored.
- If Ollama is down, incidents persist and are marked appropriately; the system does not block on AI.

Statuses (stored in DB): submitted → processing → triaged → failed

## Authentication

All requests require the header:
- `X-API-KEY: secret123`

This is a minimal, intentional mechanism suitable for internal tooling and demos.

## Folder structure

ai-incident-system/
├── backend/
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── queue.js
│       └── auth.js
├── worker/
│   └── src/
│       ├── index.js
│       └── db.js
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── main.jsx
└── docker-compose.yml

Backend, worker, and frontend are implemented as separate services to reflect real service boundaries.

## Running the system

1. Start infrastructure:
   docker compose up -d
   (This starts PostgreSQL and Redis.)

2. Install dependencies:
   - Backend:
     cd backend
     npm install
   - Worker:
     cd worker
     npm install
   - Frontend:
     cd frontend
     npm install

3. Run services (each in its own terminal):
   - Backend:
     npm run dev
   - Worker:
     npm run dev
   - Frontend:
     npm run dev

4. Open the frontend:
   http://localhost:5173

## Ollama (local LLM) setup

Install Ollama:
curl -fsSL https://ollama.com/install.sh | sh

Pull the model:
ollama pull phi3:mini

Start the server:
ollama serve

Quick test:
ollama run phi3:mini "hello"

The system treats Ollama as an enhancement: if Ollama is unavailable, the rest of the system continues to function.

## Example: submit a test incident

curl -X POST http://localhost:4000/incidents \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret123" \
  -d '{"title":"Disk Full","description":"Production disk at 100%"}'

Watch the UI or poll the API for status updates.

## Design philosophy

- The AI enriches the incident lifecycle but is not required for core functionality.
- Single source of truth (PostgreSQL) and durable job processing (Redis + BullMQ).
- Fail soft: components should degrade gracefully rather than causing system-wide failures.
- Keep services small and focused; prefer reliability and clarity over cleverness.

## Possible extensions

- Structured JSON output from the model (schema-driven)
- Automated severity and category classification
- Replace polling with WebSockets or server-sent events
- Role-based authentication and authorization
- Metrics, observability, and health dashboards
- Hot-swappable model backends

## Final notes

This project is intentionally pragmatic: it demonstrates realistic system patterns used in internal tooling where reliability, observability, and clear separation of responsibilities matter more than novelty.
