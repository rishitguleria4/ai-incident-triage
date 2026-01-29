# 🧠 AI Incident Triage System

A production‑style, end‑to‑end **asynchronous AI‑powered incident triage platform** built from scratch.

This system accepts incident reports, stores them safely, queues them for background processing, enriches them using a **local LLM (Phi‑3 via Ollama)**, and displays the results in a clean web UI.

It is intentionally designed using real backend architecture patterns used in industry:

* Control plane vs Worker plane
* Asynchronous queues
* Fault‑tolerant processing
* Background AI enrichment
* Local model inference

---

## 🚀 What This Project Demonstrates

* Full‑stack system design
* Async job processing with Redis + BullMQ
* PostgreSQL as source of truth
* Background worker architecture
* Local LLM integration (Ollama + Phi‑3 Mini)
* Graceful degradation when AI is unavailable
* Simple API‑key authentication
* Frontend polling + real‑time updates

This is **not** a chatbot.
This is an **AI‑backed infrastructure service**.

---

## 🧩 Architecture Overview

```
Browser (React)
   |
   v
Backend API (Express)
   |
   +--> PostgreSQL  (persistent storage)
   |
   +--> Redis Queue (BullMQ)
             |
             v
         Worker Service
             |
             v
       Ollama (Phi‑3 Mini)
```

### Control Plane

* Frontend
* Backend API

### Data Plane

* Redis
* Worker
* PostgreSQL
* Ollama

---

## 📦 Tech Stack

| Layer             | Technology        |
| ----------------- | ----------------- |
| Frontend          | React + Vite      |
| Backend API       | Node.js + Express |
| Worker            | Node.js + BullMQ  |
| Queue             | Redis             |
| Database          | PostgreSQL        |
| AI Model          | Phi‑3 Mini        |
| LLM Runtime       | Ollama            |
| Auth              | API Key Header    |
| Container Runtime | Docker            |

---

## ✨ Features

* Submit incident reports
* Input validation
* API‑key authentication
* Incident status lifecycle

  * submitted
  * processing
  * triaged
  * failed
* Background AI summarization
* Automatic retries
* Graceful failure handling
* Real‑time UI updates

---

## 🗂 Folder Structure

```
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
```

---

## 🔁 Data Flow (Critical)

```
User Submit
 → Backend validates
 → Backend inserts into DB
 → Backend enqueues job
 → Worker consumes job
 → Worker calls Ollama
 → Worker updates DB
 → Frontend polls and displays
```

---

## 🔐 Authentication

Every request must include:

```
X-API-KEY: secret123
```

Prevents unauthorized access.

---

## 🛠 Prerequisites

* Node.js 18+
* Docker
* Docker Compose
* Git
* Linux / macOS / WSL recommended

---

## 🐳 Start Infrastructure

```
docker compose up -d
```

Starts:

* PostgreSQL
* Redis

---

## 📥 Install Dependencies

### Backend

```
cd backend
npm install
```

### Worker

```
cd worker
npm install
```

### Frontend

```
cd frontend
npm install
```

---

## ▶️ Run Services

Open **separate terminals**.

### Backend

```
cd backend
npm run dev
```

### Worker

```
cd worker
npm run dev
```

### Frontend

```
cd frontend
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

## 🧠 Install Ollama

```
curl -fsSL https://ollama.com/install.sh | sh
```

Pull model:

```
ollama pull phi3:mini
```

Run Ollama:

```
ollama serve
```

---

## ✅ Verify Ollama

```
ollama run phi3:mini "hello"
```

API test:

```
curl http://localhost:11434/api/generate \
  -d '{
    "model": "phi3:mini",
    "prompt": "hello",
    "stream": false
  }'
```

---

## 🧪 Submit Test Incident

```
curl -X POST http://localhost:4000/incidents \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret123" \
  -d '{"title":"Disk Full","description":"Production disk at 100%"}'
```

Then visit UI.

---

## 📊 Incident Status Meanings

| Status     | Meaning                    |
| ---------- | -------------------------- |
| submitted  | Stored, waiting for worker |
| processing | Worker picked job          |
| triaged    | AI summary completed       |
| failed     | AI call failed             |

---

## ⚙ Fault Tolerance

If Ollama is offline:

* Incidents still stored
* Worker marks status = failed
* System remains usable

AI is an optional enrichment, not a hard dependency.

---

## 🌐 Remote Access (Tunneling)

To allow a reviewer to access your system remotely, use tunneling.

### Option A — Ngrok

Install:

```
sudo snap install ngrok
```

Authenticate:

```
ngrok config add-authtoken <YOUR_TOKEN>
```

Expose frontend:

```
ngrok http 5173
```

Expose backend:

```
ngrok http 4000
```

Share the generated URLs.

---

### Option B — Cloudflared (Recommended)

Install:

```
sudo apt install cloudflared
```

Expose frontend:

```
cloudflared tunnel --url http://localhost:5173
```

Expose backend:

```
cloudflared tunnel --url http://localhost:4000
```

No account required.

---

## 🧭 What Was Built (Step‑by‑Step)

1. Designed architecture
2. Built backend API
3. Added PostgreSQL
4. Added Redis queue
5. Added worker
6. Implemented async jobs
7. Added status lifecycle
8. Added validation
9. Added authentication
10. Built frontend UI
11. Integrated Ollama
12. Integrated Phi‑3 Mini
13. Prompt‑controlled output
14. Failure handling
15. Remote tunneling support

---

## 🏗 Engineering Principles Used

* Separation of concerns
* Single source of truth
* Asynchronous processing
* Graceful degradation
* Idempotent updates
* Minimal coupling

---

## 🔮 Possible Future Extensions

* Structured JSON output
* Severity classification
* Category tagging
* Role‑based auth
* WebSockets instead of polling
* Metrics dashboard
* Model hot‑swap

---

## 🏁 Final Note

This project mirrors how real internal tooling is built inside production companies.

It proves the author understands **systems**, not just frameworks.

---

**Built with intent, not tutorials.**
