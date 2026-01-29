# AI Incident Triage System  
**An end-to-end asynchronous AI-powered incident triage platform**

This is a production-style system that accepts incident reports, stores them safely, processes them asynchronously, enriches them with a **local LLM (Phi-3 via Ollama)**, and surfaces results in a clean web interface.

It is deliberately designed using the same architectural patterns used in real backend systems:

- Control plane vs worker plane  
- Background job queues  
- Persistent storage as source of truth  
- Fault-tolerant processing  
- Optional AI enrichment, not hard dependency  

This is not a chatbot.  
This is infrastructure that happens to use AI.

---

## Why I Built This

Most “AI projects” are thin wrappers around an API.

I wanted to build something closer to how real internal tools are structured:

- Requests come in  
- They are validated  
- Persisted  
- Queued  
- Processed by workers  
- Enriched  
- And only then surfaced to users  

The AI is just one stage in a larger system.

---

## What This Project Demonstrates

- Full-stack system design  
- Async job processing with Redis + BullMQ  
- PostgreSQL as a real source of truth  
- Worker service architecture  
- Local LLM inference (no cloud dependency)  
- Graceful handling when AI is unavailable  
- Simple authentication  
- Frontend polling + live updates  

In short: real backend patterns, not demos.

---

## High-Level Architecture

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


---

## Tech Stack

| Layer        | Tech |
|-------------|------|
| Frontend    | React + Vite |
| Backend API | Node.js + Express |
| Worker      | Node.js |
| Queue       | Redis + BullMQ |
| Database    | PostgreSQL |
| AI Model    | Phi-3 Mini |
| LLM Runtime | Ollama |
| Auth        | API Key |
| Infra       | Docker |

---

## How The System Works

User submits incident
→ Backend validates
→ Backend stores in DB
→ Backend enqueues job
→ Worker picks job
→ Worker calls Ollama
→ Worker updates DB
→ Frontend polls and shows result


---

## Incident Lifecycle

- submitted  
- processing  
- triaged  
- failed  

---

## Authentication

X-API-KEY: secret123


---

## Folder Structure

ai-incident-system/
├── backend/
│ └── src/
│ ├── index.js
│ ├── db.js
│ ├── queue.js
│ └── auth.js
│
├── worker/
│ └── src/
│ ├── index.js
│ └── db.js
│
├── frontend/
│ └── src/
│ ├── App.jsx
│ └── main.jsx
│
└── docker-compose.yml


---

## Running The System

### Start infrastructure

docker compose up -d


---

### Install dependencies

Backend

cd backend
npm install


Worker

cd worker
npm install


Frontend

cd frontend
npm install


---

### Run services

Backend

npm run dev


Worker

npm run dev


Frontend

npm run dev


Open:

http://localhost:5173


---

## Ollama Setup

Install

curl -fsSL https://ollama.com/install.sh | sh


Pull model

ollama pull phi3:mini


Run server

ollama serve


Test

ollama run phi3:mini "hello"


---

## Submit Test Incident

curl -X POST http://localhost:4000/incidents
-H "Content-Type: application/json"
-H "x-api-key: secret123"
-d '{"title":"Disk Full","description":"Production disk at 100%"}'


---

## Fault Tolerance

If Ollama is down:

- Incidents still stored  
- Worker marks status = failed  
- System continues running  

AI is an optional enrichment layer.

---

## Engineering Principles

- Separation of concerns  
- Single source of truth  
- Async processing  
- Fail soft  
- Minimal coupling  
- Boring but correct  

---

## Future Extensions

- Structured JSON output  
- Severity classification  
- Category tagging  
- WebSockets  
- Metrics dashboard  
- Hot-swappable models  

---

## Final Thoughts

This project mirrors how real internal tooling is built.

Not a toy.  
Not a demo.  
A real system.

Built deliberately.
