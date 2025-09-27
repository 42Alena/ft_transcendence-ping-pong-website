
___________
#     🏓    /ft_transcendence-ping-pong-website    🏓 
_______________
🚧 **Status: In Progress** 🚧  

Final capstone project at [42 Berlin](https://42berlin.de/) — a project-based, peer-to-peer software engineering program.  
At 42, students learn by **building real systems**, **reviewing each other’s code**, and **defending their work live**.  
This repository reflects that approach: teamwork, code reviews, and strict compliance with technical specifications.

---

## 👥 Team

| | Member | Role | GitHub |
|-|---------|------|--------|
|🟣|**Alena**| Backend & Real-Time Lead (Fastify, User Mgmt, Sockets, Chat) | [@42Alena](https://github.com/42Alena) |
|🟢| **Sveva**| Game & Frontend Lead (Canvas, AI, Tailwind, Customization) | [@svevotti](https://github.com/svevotti) |
|🔵|  **Luis**| **Database & Data Protection Lead** (SQLite schema & migrations, WAL/perf, data lifecycle, GDPR deletion/anonymization, observability & DB health) | [@Numbersdontlie](https://github.com/Numbersdontlie) |

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🛠 Tech Stack

[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-Backend-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![SQLite](https://img.shields.io/badge/SQLite-DB-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![42 Berlin](https://img.shields.io/badge/42-Berlin-000000?logo=42&logoColor=white)](https://42berlin.de/)

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🧭 Navigation
- [Project Overview](#-project-overview)
- [About 42 Berlin](#-about-42-berlin)
- [Modules (Main + 7 majors)](#-modules-main--7-majors)
- [Team & Responsibilities](#-team--responsibilities)
- [Tech & Languages](#-tech--languages)
- [Folder Structure](#-folder-structure-important-parts-only)
- [How to Run](#-how-to-run)
- [Security & Privacy](#-security--privacy)
- [Evaluation Checklist](#-evaluation-checklist-internal)
- [Contributors](#-contributors)
- [License](#-license)

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🌟 Project Overview

We are developing a **production-ready, secure, single-page web application** built around the classic **Pong** game.  

Key features include:
- 🎮 **Remote Multiplayer** – WebSockets with safe reconnect, pause/resume on disconnect.  
- 💬 **Live Chat** – Direct messages, block list, match invites, notifications.  
- 🤖 **AI Opponent** – Subject-compliant: keyboard simulation only, refresh every 1s, same paddle speed, can win, uses power-ups.  
- 👥 **Profiles & Stats** – Accounts, avatars, friends/online, match history.  
- 🔐 **Privacy by Design** – GDPR endpoints for account deletion & anonymization.  
- 🚀 **Deployment** – HTTPS/WSS via proxy, reproducible with **one Docker command**.  
- 🎨 **Frontend** – TypeScript + Tailwind SPA (no framework, History API navigation).  
- 🧰 **Data reliability (Luis)** — consistent schema, constraints, WAL journaling, DB health checks, safe deletes/anonymization.

**Goal:** Run everything with one Docker command.  
**Requirement:** Must work in Firefox (also tested in Chrome).  

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🌍 About 42 Berlin

[42 Berlin](https://42berlin.de/) is part of the international 42 network:  
- **Project-based learning** — no teachers, no lectures.  
- **Peer-to-peer collaboration** — students review and defend each other’s work.  
- **Industry focus** — projects simulate real-world software engineering challenges.  

ft_transcendence is the **final web project** in the curriculum: it proves skills in **web security, real-time networking, databases, and deployment**.

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 📌 Modules (Main + 7 majors)

> **Current plan (subject-compliant) — may change as the project evolves.**  

| Module (subject name) | Lead | Where (paths) | Tools | Acceptance |
|---|---|---|---|---|
| **MAIN (SPA, Docker, HTTPS/WSS)** | **Alena  Luis  Sveva** | `frontend/`, root `docker-compose.yml` | TS SPA + proxy | SPA Back/Forward works; one command boots all; alias-only tournament works. |
| **[Web — Fastify backend]** | **Alena** | `backend/src/**` | Fastify | REST routes with JSON schemas; `/healthz` returns 200. |
| **[User Management — Standard User Management]** | **Alena** | `backend/src/lib/Class/**` | TypeScript + Fastify | Register/login; profiles; avatars; friends/online; stats/history; passwords hashed. |
| **[Gameplay & UX — Remote Players]** | **Alena** | `backend/src/main.ts` (sockets) | Socket.IO | Rooms; paddle/ball/score sync with timestamps; reconnect safety. |
| **[Gameplay & UX — Live Chat]** | **Alena** | `frontend/src/chat/**`, `backend/src/**` | Socket.IO + TS | DM/block/invite; tournament notifications; profile view from chat. |
| **[Web (minor) — Tailwind] + [Gameplay & UX (minor) — Game Customization]** | **Sveva** | `frontend/src/ui/**`, `frontend/src/settings/**` | Tailwind + TS | Responsive UI; settings (speed, paddle size, power-ups) applied to game & AI. |
| **[AI-Algo — AI Opponent]** | **Sveva** | `frontend/src/game/**` | Canvas + TS | Keyboard sim only; refresh every 1s; same paddle speed as humans; can win; uses power-ups. |
| **[Web (minor) — SQLite: Schema & Init]** *(counts)* | **Luis** | `backend/src/db/**` | SQLite + TS | **Idempotent migrations; foreign keys enforced; WAL mode; unique constraints; indices on hot paths; DB health endpoint green.** |
| **[Cybersecurity (minor) — GDPR/Account Deletion]** *(counts)* | **Luis** | `backend/src/routes/gdpr.ts` | Fastify | **DELETE → hard-delete user + anonymize match history; POST /anonymize → mask PII (username/avatar/email); audit-safe logs; race-safe with transactions.** |

**Total:** 5 direct majors + (Tailwind+Customization = 1 major) + (SQLite+GDPR = 1 major) → **7 majors** ✅

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 👥 Team & Responsibilities

### 🟣  Alena — Backend & Real-Time Lead  
**Modules:** Fastify backend · User Management · Remote Players · Live Chat  

| Area | Tasks | Why (subject link) | Acceptance |
|---|---|---|---|
| **Fastify backend** | REST skeleton with `/healthz`, `/users`, `/matches`; JSON schema validation; error handling; Docker integration | Required by *Web — Fastify backend* | `curl /healthz` → 200; invalid payload rejected |
| **User Management** | Domain classes (`User`, `UserManager`, `Chat`); register/login; profiles; avatars; friends/online; stats/history; passwords hashed | Matches *Standard User Management* module | Register/login works; profile shows avatar/stats; password in DB is hashed |
| **Remote Players** | Socket.IO rooms; join/leave lifecycle; paddle/ball/score sync with timestamps; reconnect = pause/resume | Matches *Remote Players* module | Two browsers play; unplug → game pauses; replug → resumes |
| **Live Chat** | DM/block/invite; tournament notifications; profile peek from chat; shared DTOs/events with frontend | Matches *Live Chat* module | Blocked DM refused; invite → match created; notification visible |

---

### 🟢 Sveva — Game & Frontend Lead  
**Modules:** Tailwind + Customization · AI Opponent  

| Area | Tasks | Why (subject link) | Acceptance |
|---|---|---|---|
| **Tailwind UI** | Responsive SPA layout; resize handling; colors & typography; HUD styled consistently | Required by *Web (minor) — Tailwind* | Resize window → layout adapts; no overflow |
| **Customization menu** | Paddle size, ball speed, power-ups; settings applied to game + AI | Required by *Gameplay & UX (minor) — Customization* | Change paddle size → affects both player & AI |
| **Rendering & physics** | Frame-timed render loop (`requestAnimationFrame`); deterministic physics; paddle/ball collisions; scoring; stable under resize/tab-switch | Needed for core gameplay | Game runs smoothly; no tunneling; score updates correctly |
| **AI Opponent** | Keyboard simulation only; refresh every 1s; same paddle speed as human; uses power-ups; can win | Explicit rules in *AI Opponent* module | AI key presses logged; wins some games |
| **Tournament (alias)** | Alias entry; bracket flow; “next match” notification | Subject requires alias-only tournament | Start tournament without login → next match displayed |

---

### 🔵  Luis — Database & Data Protection Lead  
**Modules:** SQLite · GDPR/Account Deletion  

| Area | Tasks | Why (subject link) | Acceptance |
|---|---|---|---|
| **SQLite schema & integrity** | Design `users`, `matches` (FKs, `ON DELETE SET NULL`/`CASCADE` where sensible), unique constraints (username/email), indices (e.g., `matches(winner_id, created_at)`), **PRAGMA foreign_keys=ON** | Required by *SQLite: Schema & Init* | Schema created idempotently; FKs enforced; inserts violating constraints fail with clear errors |
| **Migrations & startup** | Idempotent migration scripts at boot; safe re-run; seed for local dev; **WAL journaling** for concurrent reads; **busy timeout** | Operability & stability | Multiple restarts don’t duplicate; WAL active; DB health green |
| **DB health & observability** | `/db/health` route (returns PRAGMA checks + file size + WAL status); log slow queries (>50ms) | Evaluator clarity | `curl /db/health` → 200 JSON with status: "ok" |
| **Backups & maintenance** | Document portable backup (`sqlite3 app.db ".backup app.backup.db"`); periodic `VACUUM` and `ANALYZE` guidance; volume path configurable (`SQLITE_PATH`) | Data safety in demo/eval | Backup file created; DB size stable after vacuum |
| **GDPR endpoints** | `DELETE /users/:id` → hard-delete account, **anonymize** matches (keep gameplay stats but remove PII); `POST /users/:id/anonymize` → mask PII (username/avatar/email) while keeping relationships | Required by *GDPR/Account Deletion* | Hitting endpoints updates DB correctly; subsequent profile fetch shows masked/removed data |
| **Transaction safety** | Wrap GDPR ops in a single transaction; handle races (e.g., simultaneous match write) via retry/backoff | Consistency under load | No half-deleted state; logs show committed tx |

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🧪 Tech & Languages

- **Languages:** TypeScript, HTML, CSS  
- **Runtime:** Node.js  
- **Backend:** Fastify, Socket.IO (WSS), SQLite  
- **Frontend:** TypeScript + Tailwind (no framework; History API)  
- **Security:** HTTPS/WSS, Argon2id password hashing, GDPR endpoints  
- **Ops (Luis):** **WAL mode**, **foreign_keys ON**, **idempotent migrations**, **DB health route**, **documented backup** procedure, **.env** with `SQLITE_PATH`

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🗂️ Folder Structure (important parts only)

```

.
├─ backend/
│  ├─ src/
│  │  ├─ db/              # ← (Luis) migrations, sqlite helpers, pragmas, health checks
│  │  ├─ lib/Class/       # User, Chat, UserManager
│  │  ├─ types/           # Shared backend types
│  │  ├─ utils/           # Validation helpers
│  │  ├─ routes/          # REST API (chat, GDPR, users, db/health)
│  │  └─ main.ts          # Fastify entrypoint + sockets
│  ├─ tests/              # Unit / integration tests
│  ├─ Dockerfile
│  └─ package.json
│
├─ frontend/
│  ├─ public/             # Host page + assets
│  │  ├─ styles/index.html# SPA host page
│  │  └─ styles/style.css # Stylesheet
│  └─ src/                # SPA source (chat, game, ui, settings planned)
│
├─ docker-compose.yml
└─ README.md

````

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🚀 How to Run

### Production / Evaluation
```bash
git clone <this-repo>
cd ft_transcendence
cp .env.example .env
docker-compose up --build

# Open:
https://localhost
````

### Development

```bash
# Backend
cd backend
npm ci
npm run dev

# Frontend
cd frontend
# serve /public or /dist as static content

# Open (dev):
https://localhost:5173
```

**Services & Ports**

* Proxy → `443` (TLS termination, WS upgrade)
* Backend → `3000` (proxied behind 443, WSS enabled)
* Frontend → static via proxy (`/`)

**Required env vars**

| Var           | Where   | Example             | Purpose            |
| ------------- | ------- | ------------------- | ------------------ |
| `PORT`        | backend | `3000`              | API port           |
| `APP_URL`     | backend | `https://localhost` | CORS/cookie origin |
| `SQLITE_PATH` | backend | `./data/app.db`     | DB file path       |

**(Luis) Useful DB ops during defense**

```bash
# Health:
curl -s https://localhost/db/health | jq

# Safe backup (file-copy friendly):
sqlite3 ./data/app.db ".backup ./data/app.backup.db"

# Inspect pragmas quickly:
sqlite3 ./data/app.db "PRAGMA journal_mode; PRAGMA foreign_keys;"
```

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🔐 Security & Privacy

* **HTTPS/WSS** enforced in production.
* **Passwords**: Argon2id or bcrypt.
* **GDPR (Luis):**

  * `DELETE /users/:id` → remove account; **anonymize** references in `matches` so statistics remain but PII does not.
  * `POST /users/:id/anonymize` → mask personal fields while keeping account for gameplay history.
  * All GDPR mutations run inside a **transaction**; logs include request IDs for traceability.
* **Data minimization:** only store what gameplay needs (user id, alias, match stats).

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## ✅ Evaluation Checklist (internal)

* TypeScript SPA (no frontend framework), Back/Forward works
* Works in **Firefox** (mandatory) and Chrome (optional)
* One Docker command from repo root
* HTTPS + WSS everywhere
* Tournament supports **alias-only** + accounts
* Remote players with reconnect safety
* Live Chat: **DM, block, invite, notifications**
* AI: **keyboard simulation**, **refresh = 1s**, **same paddle speed**, **can win**
* GDPR: **delete/anonymize** endpoints functional
* **DB (Luis):** WAL on; foreign keys enforced; migrations idempotent; `/db/health` returns **ok**; backup command demonstrated

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 👥 Contributors


| Member | Role | GitHub |
|--------|------|--------|
| 🟣 **Alena ** | Backend & Real-Time Lead (Fastify, User Mgmt, Sockets, Chat) | [@42Alena](https://github.com/42Alena) |
| 🟢 **Sveva** | Game & Frontend Lead (Canvas, AI, Tailwind, Customization) | [@svevotti](https://github.com/svevotti) |
| 🔵 **Luis** | **Database & Data Protection Lead** (SQLite schema & migrations, WAL/perf, data lifecycle, GDPR deletion/anonymization, observability & DB health) | [@Numbersdontlie](https://github.com/Numbersdontlie) |

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 📄 License

MIT

[↑ back to top](#-ft_transcendence-ping-pong-website)

