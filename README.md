AI Incident Triage System

An end-to-end asynchronous AI-powered incident triage platform

This is a production-style system that accepts incident reports, stores them safely, processes them asynchronously, enriches them with a local LLM (Phi-3 via Ollama), and surfaces results in a clean web interface.

It is deliberately designed using the same architectural patterns used in real backend systems:

Control plane vs worker plane

Background job queues

Persistent storage as source of truth

Fault-tolerant processing

Optional AI enrichment, not hard dependency

This is not a chatbot.
This is infrastructure that happens to use AI.

Why I Built This

Most “AI projects” are thin wrappers around an API.

I wanted to build something closer to how real internal tools are structured:

Requests come in

They are validated

Persisted

Queued

Processed by workers

Enriched

And only then surfaced to users

The AI is just one stage in a larger system.

What This Project Demonstrates

Full-stack system design

Async job processing with Redis + BullMQ

PostgreSQL as a real source of truth

Worker service architecture

Local LLM inference (no cloud dependency)

Graceful handling when AI is unavailable

Simple authentication

Frontend polling + live updates

In short: real backend patterns, not demos.

High-Level Architecture
Browser (React)
   |
   v
Backend API (Express)
   |
   +--> PostgreSQL
   |
   +--> Redis Queue
             |
             v
         Worker Service
             |
             v
       Ollama (Phi-3 Mini)

Control Plane

Frontend

Backend API

Data / Worker Plane

Redis

Worker

PostgreSQL

Ollama

Each part has a single responsibility.

Tech Stack
Layer	Tech
Frontend	React + Vite
Backend API	Node.js + Express
Worker	Node.js
Queue	Redis + BullMQ
Database	PostgreSQL
AI Model	Phi-3 Mini
LLM Runtime	Ollama
Auth	API Key
Infra	Docker

Nothing exotic. All proven.

How The System Actually Works
User submits incident
 → Backend validates
 → Backend stores in DB
 → Backend enqueues job
 → Worker picks job
 → Worker calls Ollama
 → Worker updates DB
 → Frontend polls and shows result


If the worker dies, the incident is still stored.
If Ollama dies, the incident still exists.
The system never blocks on AI.

Incident Lifecycle

submitted → stored and waiting

processing → worker picked it up

triaged → AI summary completed

failed → AI step failed

Statuses live in the database, not memory.

Authentication

Every request requires:

X-API-KEY: secret123


Simple, intentional, and sufficient for internal tooling.

Folder Structure
ai-incident-system/
├── backend/
│   └── src/
│       ├── index.js
│       ├── db.js
│       ├── queue.js
│       └── auth.js
│
├── worker/
│   └── src/
│       ├── index.js
│       └── db.js
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── main.jsx
│
└── docker-compose.yml


Backend, worker, and frontend are separate services.
No monolith pretending to be microservices.

Running The System
Start infrastructure
docker compose up -d


Starts PostgreSQL and Redis.

Install dependencies

Backend:

cd backend
npm install


Worker:

cd worker
npm install


Frontend:

cd frontend
npm install

Run services (separate terminals)

Backend:

npm run dev


Worker:

npm run dev


Frontend:

npm run dev


Open:

http://localhost:5173

Ollama Setup

Install:

curl -fsSL https://ollama.com/install.sh | sh


Pull model:

ollama pull phi3:mini


Run server:

ollama serve


Test:

ollama run phi3:mini "hello"

Submitting A Test Incident
curl -X POST http://localhost:4000/incidents \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret123" \
  -d '{"title":"Disk Full","description":"Production disk at 100%"}'


Watch status change in UI.

Fault Tolerance Philosophy

If Ollama is down:

Backend still accepts incidents

DB still stores them

Worker marks status as failed

System continues running

AI is an enhancement layer, not a single point of failure.

This is intentional.

Engineering Principles Applied

Separation of concerns

Single source of truth

Async everywhere it matters

Fail soft, not hard

Minimal coupling

Boring but correct

Boring systems scale. Fancy ones break.

Possible Extensions

Structured JSON output from model

Severity & category classification

WebSockets instead of polling

Auth roles

Metrics dashboard

Hot-swappable models

None of these require redesigning the system.

Final Thoughts

This project mirrors how internal tooling is actually built inside production environments.

It shows understanding of:

Backend architecture

Data flow

Failure modes

And where AI realistically fits

Not a toy.
Not a tutorial clone.
A real system.

Built deliberately.
