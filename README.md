
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
- 🧰 **Data reliability ** — consistent schema, constraints, WAL journaling, DB health checks, safe deletes/anonymization.

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

## 📌 CURRENT Modules (Main + 7 majors)

> **Current plan (subject-compliant) — may change as the project evolves.**  
Done! I removed the **Status** column and marked undecided items with **?** in the **Counted** column.

| Module (exact subject name)                                                                                             | Lead                 | Where (paths)                                          | Tools            | Evidence                      |  Points | Counted |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------ | ---------------- | ----------------------------- | ------: | :-----: |
| **MAIN (Mandatory: SPA, Docker, HTTPS/WSS)**                                                                            | Alena . Luis . Sveva | `frontend/`, `docker-compose.yml`                      | TS SPA + proxy   | `make up`, SPA Back/Forward   |   **0** |    ✓    |
| **Web — Major: Use a framework to build the backend (Fastify)**                                                         | Alena                | `backend/src/**`                                       | Fastify          | `GET /healthz` = 200          |   **1** |    ✓    |
| **User Management — Major: Standard user management, authentication, users across tournaments**                         | Alena                | `backend/src/lib/Class/**`                             | TS + Fastify     | `POST /users`, `POST /login`  |   **1** |    ✓    |
| **Gameplay and user experience — Major: Live chat**                                                                     | Alena                | `frontend/src/chat/**`, `backend/src/**`               | Socket.IO + TS   | chat echo/DM/block            |   **1** |    ✓    |
| **AI-Algo — Major: Introduce an AI opponent**                                                                           | Sveva                | `frontend/src/game/**`                                 | Canvas + TS      | AI wins a round               |   **1** |    ✓    |
| **Web — Minor: Use a framework or a toolkit to build the frontend (Tailwind CSS)**                                      | Sveva                | `frontend/src/ui/**`                                   | Tailwind + TS    | responsive screenshots        | **0.5** |    ✓    |
| **Web — Minor: Use a database for the backend (SQLite)**                                                                | Luis                 | `backend/src/db/**`                                    | SQLite + TS      | PRAGMAs / health route        | **0.5** |    ✓    |
| **Cybersecurity — Minor: GDPR compliance options with user anonymization, local data management, and Account Deletion** | Luis                 | `backend/src/routes/gdpr.ts`                           | Fastify          | delete/anonymize/export demo  | **0.5** |    ✓    |
| **Accessibility — Minor: Expanding browser compatibility**                                                              | Sveva                | `docs/compat.md`, e2e                                  | TS + Tailwind    | Chrome+Firefox matrix         | **0.5** |    ✓    |
| **Gameplay and user experience — Major: Remote players**                                                                | Alena . Sveva                | `backend/src/main.ts`                                  | Socket.IO        | `joinMatch/state/input`       |   **1** |  **?**  |
| **Gameplay and user experience — Minor: Game customization options**                                                    | ? Sveva                | `frontend/src/settings/**`                             | Tailwind + TS    | settings affect game & AI     | **0.5** |  **?**  |
| **Accessibility — Minor: Support on all devices** *(easy add)*                                                          | ? Sveva                | `frontend/src/ui/**`                                   | Tailwind + TS    | phone/tablet/desktop checks   | **0.5** |  **?**  |
| **AI-Algo — Minor: User and game stats dashboards** *(easy add)*                                                        | ? Luis                 | `backend/src/routes/stats.ts`, `frontend/src/stats/**` | SQLite + TS      | `/me/stats`, `/matches/stats` | **0.5** |  **?**  |
| **Accessibility — Minor: Multiple language support** *(easy add)*                                                       | ? Sveva                | `frontend/src/i18n/**`                                 | TS (simple i18n) | 3 languages + switcher        | **0.5** |  **?**  |

### Totals (Counted ✓ only)

* Majors: **4.0** (Backend, User Mgmt, Live Chat, AI)
* Minors: **2.0** (Tailwind, SQLite, GDPR, Browser Compatibility)
* **Total = 6.0 majors**

 * need  **7.0**  


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
│  ├─ db/                #  migrations, sqlite helpers, pragmas, health
│  ├─ src/
│  │  checks
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

