
#     🏓  transcendence — Real-Time Ping-Pong with Multiplayer, Chat, AI & Secure Accounts 🏓 
_______________
🚧 **Status: IN PROGRESS** 🚧  
___________


## Final project in the curriculum at [42 Berlin](#about-42-berlin).


After mastering **C, C++ and Bash ...**, We’re building a **full-stack TypeScript web app**: a real-time **Ping-Pong** game with **remote multiplayer**, **live chat**, an **AI opponent**, **secure user accounts** (GDPR tools), **SQLite** persistence, and **Dockerized HTTPS/WSS** deployment.

---

## 🧭 Navigation
- [About 42 Berlin](#-about-42-berlin)
- [Team & Responsibilities](#-team--responsibilities)
- [Tech & Languages](#-tech--languages)
- [Project Overview](#-project-overview)
- [Folder Structure](#-folder-structure-important-parts-only)
- [How to Run](#-how-to-run)
- [License](#-license)

[↑ back to top](#-ft_transcendence-ping-pong-website)
---
## 🌍 About 42 Berlin

[42 Berlin](https://42berlin.de/)  **Software Engineering** School is part of the international 42 network:  

* **Project-based learning** — no teachers, no lectures.
* **Self-learning** — you plan your time and scope, set milestones, learn what’s needed just-in-time, and practice self-organization and focus on what matters now.
* **Peer-to-peer collaboration** — students review, test, and defend each other’s work.
* **Industry focus** — projects simulate real-world engineering challenges.

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

---
## 👥 Team  "We Are trAScendeLs: 🧩 Alena · 🎨 Sveva · 🔐 Luis "


| | Member | Role | GitHub |
|-|---------|------|--------|
|🧩|**Alena**| Backend & Real-Time Lead (Backend, Fastify, User Management, Sockets, Chat, DB) | [@42Alena](https://github.com/42Alena) |
|🎨| **Sveva**| Game & Frontend Lead (Canvas, AI, Tailwind, Customization) | [@svevotti](https://github.com/svevotti) |
|🔐|  **Luis**| **Database & Data Protection Lead** (SQLite schema & migrations,   GDPR ) | [@Numbersdontlie](https://github.com/Numbersdontlie) |

[↑ back to top](#-ft_transcendence-ping-pong-website)

---

## 🛠 Tech & Languages

[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-Backend-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![SQLite](https://img.shields.io/badge/SQLite-DB-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![42 Berlin](https://img.shields.io/badge/42-Berlin-000000?logo=42&logoColor=white)](https://42berlin.de/)


- **Languages:** TypeScript, HTML, CSS  
- **Runtime:** Node.js  
- **Backend:** Fastify, Socket.IO (WSS), SQLite  
- **Frontend:** TypeScript + Tailwind (no framework; History API)  
- **Security & Ops:** HTTPS/WSS; hashed passwords; GDPR (export/anonymize/delete) endpoints; SQLite in **WAL** mode with **foreign_keys=ON**; **Knex** idempotent migrations; `/db/healthz` (PRAGMAs + size); `.env` config (e.g., `SQLITE_PATH`, secrets)



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



## 📌 CURRENT Modules (Main + 7 majors)

> **Current plan (subject-compliant) — may change as the project evolves.**  
Done! I removed the **Status** column and marked undecided items with **?** in the **Counted** column.

| Module (exact subject name)                                                                                             | Lead                 | Where (paths)                                          | Tools            | Evidence                      |  Points | Counted |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------ | ---------------- | ----------------------------- | ------: | :-----: |
| **MAIN (Mandatory: SPA, Docker, HTTPS/WSS)**                                                                            | Alena  Sveva Luis  | `frontend/`, `docker-compose.yml`                      | TS SPA + proxy   | `make up`, SPA Back/Forward   |   **MUST** |    ✓    |
| **Web — Major: Use a framework to build the backend (Fastify)**                                                         | Alena                | `backend/src/**`                                       | Fastify          | `GET /healthz` = 200          |   **1** |    ✓    |
| **User Management — Major: Standard user management, authentication, users across tournaments**                         | Alena                | `backend/src/lib/Class/**`                             | TS + Fastify     | `POST /users`, `POST /login`  |   **1** |    ✓    |
| **Gameplay and user experience — Major: Live chat**                                                                     | Alena                | `frontend/src/chat/**`, `backend/src/**`               | Socket.IO + TS   | chat echo/DM/block            |   **1** |    ✓    |
| **AI-Algo — Major: Introduce an AI opponent**                                                                           | Sveva                | `frontend/src/game/**`                                 | Canvas + TS      | AI wins a round               |   **1** |    ✓    |
| **Web — Minor: Use a framework or a toolkit to build the frontend (Tailwind CSS)**                                      | Sveva                | `frontend/src/ui/**`                                   | Tailwind + TS    | responsive screenshots        | **0.5** |    ✓    |
| **Web — Minor: Use a database for the backend (SQLite)**                                                                | Alena Luis                 | `backend/src/db/**`                                    | SQLite + TS      | PRAGMAs / health route        | **0.5** |    ✓    |
| **Cybersecurity — Minor: GDPR compliance options with user anonymization, local data management, and Account Deletion** | Alena Luis                 | `backend/src/routes/gdpr.ts`                           | Fastify          | delete/anonymize/export demo  | **0.5** |    ✓    |
| **Accessibility — Minor: Expanding browser compatibility**                                                              | Sveva                | `docs/compat.md`, e2e                                  | TS + Tailwind    | Chrome+Firefox matrix         | **0.5** |    ✓    |
| **Gameplay and user experience — Minor: Game customization options**                                                    | ? Sveva                | `frontend/src/settings/**`                             | Tailwind + TS    | settings affect game & AI     | **0.5** |  **?**  |
| **Accessibility — Minor: Support on all devices** **                                                          | ? Sveva                | `frontend/src/ui/**`                                   | Tailwind + TS    | phone/tablet/desktop checks   | **0.5** |  **?**  |
| **Accessibility — Minor: Multiple language support** **                                                       | ?                | `frontend/src/i18n/**`                                 | TS (simple i18n) | 3 languages + switcher        | **0.5** |  **?**  |

### Totals (Counted ✓ only)

* Majors: **4.0** (Backend, User Mgmt, Live Chat, AI)
* Minors: **2.0** (Tailwind, SQLite, GDPR, Browser Compatibility)
* **Total = 7.0 majors**

 * need  **7.0**  


[↑ back to top](#-ft_transcendence-ping-pong-website)



---

## 🗂️ Folder Structure (important parts only)

```

.
├─ backend/ 
│  ├─ db/                #  migrations, sqlite helpers, pragmas, health
│  ├─ src/
│  │  ├─ lib/Class/       # User, Chat, UserManager
│  │  ├─ types/           # Shared backend types
│  │  ├─ utils/           # Validation helpers
│  │  ├─ routes/          # REST API (chat, GDPR, users,  /healthz)
│  │  └─ main.ts          # Fastify entrypoint + sockets
│  ├─ tests/              # Unit / integration tests
│  ├─ Dockerfile
│  └─ package.json
│
├─ frontend/
│  ├─ public/             # Host page + assets
│  │  ├─ styles/index.html# SPA host page
│  │  └─ styles/style.css # Stylesheet
│  ├─ src/                # SPA source (chat, game, ui, settings planned)
│  └─ Dockerfile
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
make 

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

## 📄 License

MIT

[↑ back to top](#-ft_transcendence-ping-pong-website)

