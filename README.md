
# 🏓 ft_transcendence

A real-time Pong web app with **secure auth (JWT + 2FA)**, **remote multiplayer** over **WSS**, **live chat**, **AI opponent**, and a **TypeScript SPA** styled with **Tailwind**.  
Goal: **one Docker command** to run; must work in **Firefox** (also tested in Chrome).

---

## 📚 Menu

- [1) Project Description](#1-project-description)  
- [2) Modules (Main + 7 majors)](#2-modules-main--7-majors)  
- [3) Team Roles (overview + detailed tasks)](#3-team-roles-overview--detailed-tasks)  
- [4) How to Run](#4-how-to-run)  
- [5) Folder Structure](#5-folder-structure)  
- [6) Compliance Checklist](#6-compliance-checklist)  
- [7) Clarifications (Subject & Eval)](#7-clarifications-subject--eval)

---

## 1) Project Description

### What it is
Multiplayer **Pong** in the browser with:  
- **Live Chat** (DM, block, invite)  
- **Tournament** (alias-only or accounts)  
- **AI Opponent** (same rules/speed as humans)  
- **Profiles & stats**

Delivered as a **single-page app** started with **one Docker command**.

### How it works
- **Frontend:** **TypeScript SPA (no frontend framework)** + **Tailwind**.  
  Uses the **History API** (Back/Forward works without reloads).  
- **Backend:** **Fastify (Node.js)** + **SQLite**. REST APIs + **Socket.IO** for realtime (**WSS** in production).  
- **Realtime model:** One **Socket.IO room per match**; disconnect → pause; reconnect → resume with state.  
- **Security:** **HTTPS/WSS**, **JWT in HttpOnly, Secure, SameSite=Strict cookies** (not localStorage), server-side validation, **Argon2id** password hashing, secrets in `.env`.

---

## 2) Modules (Main + 7 majors)

| Module | Lead | Where (paths) | Tools | Acceptance |
|---|---|---|---|---|
| **MAIN (SPA, Docker, HTTPS/WSS)** | All | `frontend/`, root `docker-compose.yml` | TS SPA + proxy | SPA Back/Forward works; one command boots all; alias-only tournament works. |
| **Fastify backend** | Luis | `backend/src/**` | Fastify + SQLite | REST routes with schemas; `/healthz`; DB bootstrap. |
| **User Management** | Sveva (+Luis) | `backend/src/routes/**`, `frontend/src/**` | TS + Fastify | Register/Login, profile, friends/online, stats/history. |
| **2FA + JWT** | Luis | `backend/src/auth/**` | jsonwebtoken, otplib | TOTP enroll/verify; JWT in HttpOnly cookie; protected routes. |
| **Remote Players** | Alena | `backend/src/main.ts` (sockets) | Socket.IO | Rooms; paddle/ball/score sync; reconnect safety. |
| **Live Chat** | Alena | `frontend/src/chat/**`, `backend/src/**` | Socket.IO + TS | DM/block/invite; notifications. |
| **Tailwind + Customization (2 minors)** | Alena | `frontend/src/settings/**` | Tailwind + TS | Settings UI (speed, paddle size, power-ups); synced to gameplay & AI. |
| **AI Opponent** | Sveva | `frontend/src/game/**` | Canvas + TS | AI: keyboard sim, 1s refresh, same paddle speed; can win; uses power-ups. |

> **AI – 3 hard constraints (explicit):**  
> 1) **Keyboard Simulation Only** (never set paddle position directly).  
> 2) **View Refresh = 1 second** (predict bounces between refreshes).  
> 3) **Same paddle speed** as humans (no cheating); if power-ups exist, **AI uses them**.

---

## 3) Team Roles (overview + detailed tasks)

### 3.1 Common team tasks
- Keep **contracts** (events, DTOs, constants) consistent across backend & frontend.  
- Branch → PR → review; clean commits.  
- Maintain `.env.example`; never commit secrets.  
- Test on **Firefox** (mandatory) and Chrome (optional).  
- Ensure **SPA Back/Forward** works (History API + proxy fallback).  
- Keep **Docker** reproducible (one command from repo root).

### 3.2 Roles overview

| Person | Role | High-level steps | Tools |
|---|---|---|---|
| **Alena** | Real-Time Systems Lead | Socket layer (JWT handshake, rooms, events, reconnect), remote sync (paddle/ball/score), **Live Chat** (DM/block/invite), **Customization UI** (Tailwind), shared contracts. | TypeScript, Socket.IO, Tailwind, Vite (dev), Docker Compose |
| **Luis** | Backend & Auth Lead | Fastify bootstrap, SQLite schema/migrations, REST (auth/2FA, me, matches, friends, history), **JWT in HttpOnly cookie**, **TOTP 2FA**, WS auth, `.env` loader/docs, **Argon2id** hashing. | TypeScript, Fastify, SQLite, argon2/bcrypt, jsonwebtoken, otplib |
| **Sveva** | Game Logic & AI Lead | Canvas loop (local 2P), physics/collisions, **Tournament** (alias, bracket, next-match), **AI** (keyboard sim, 1s refresh, predictive, same speed, can win, uses power-ups), apply customization, save results & stats. | TypeScript, Canvas API, game math, Socket.IO (client), REST/Fetch |

### 3.3 Detailed task tables

#### 👤 Alena — Real-Time Systems Lead
| Task | Path | Tools | Priority | Acceptance |
|---|---|---|---:|---|
| JWT handshake → `socket.data.userId` | `backend/src/main.ts` | Socket.IO | 5 | Invalid JWT refused; valid sockets have `userId`. |
| Match rooms (join/leave; lifecycle) | `backend/src/main.ts` | Socket.IO | 5 | Membership tracked; cleanup on leave. |
| Paddle/ball/score sync (throttled; timestamps) | `backend/src/main.ts` | Socket.IO | 5 | Opponent sees paddle quickly; ball snapshots timestamped. |
| Reconnect policy (pause → rejoin → catch-up) | `backend/src/main.ts` | Socket.IO | 5 | Disconnect pauses; reconnect resends state. |
| Live Chat (DM/block/invite) | `frontend/src/chat/**` + `backend/src/**` | TS + Tailwind + Socket.IO | 6 | Block works; invite creates match; notifications appear. |
| Tailwind base + HUD | `frontend/src/ui/**` (planned) | Tailwind | 7 | Consistent typography; responsive HUD. |
| Settings UI | `frontend/src/settings/**` | TS + Tailwind | 7 | Settings affect gameplay & AI. |
| Shared contracts | `frontend/src/shared/**` (planned) | TS | 7 | Coordinated changes across team. |

#### 🔒 Luis — Backend & Auth Lead
| Task | Path | Tools | Priority | Acceptance |
|---|---|---|---:|---|
| Fastify bootstrap (CORS, errors, logging) | `backend/src/main.ts` | Fastify | 2 | `/healthz` 200; CORS correct. |
| SQLite schema + migrations | `backend/src/db/**` | better-sqlite3 | 2 | Tables created idempotently. |
| REST routes: auth/2FA, `/me`, matches, friends | `backend/src/routes/**` | Fastify | 2 | JSON schema validation; correct 2xx/4xx. |
| Argon2id password hashing | `backend/src/auth/**` | argon2/bcrypt | 4 | Strong params; verified on login. |
| JWT issue/verify → HttpOnly cookie | `backend/src/auth/**` | jsonwebtoken | 4 | `HttpOnly; Secure; SameSite=Strict`; expiry ~1h. |
| TOTP 2FA enroll/verify | `backend/src/auth/**` | otplib | 4 | QR enroll; code verified. |
| WS auth (JWT in handshake) | `backend/src/main.ts` | Fastify + Socket.IO | 4 | Missing/invalid token refused. |
| `.env` loader + docs | `backend/` | dotenv | 2 | Fails fast if env missing. |

#### 🎮 Sveva — Game Logic & AI Lead
| Task | Path | Tools | Priority | Acceptance |
|---|---|---|---:|---|
| Canvas loop + local 2-player | `frontend/src/game/canvas/**` | TS + Canvas | 1 | Two paddles; 60fps; scoring correct. |
| Physics & collisions | `frontend/src/game/logic/**` | TS | 1 | Deterministic; no tunneling. |
| Tournament (alias-only + bracket) | `frontend/src/tournament/**` | TS (+ sockets) | 3 | Alias flow without login; bracket notifies next match. |
| AI: keyboard sim, 1s refresh, same speed | `frontend/src/game/ai/**` | TS | 8 | Meets constraints; human vs AI playable. |
| Apply customization to physics & AI | `frontend/src/game/**` | TS | 7 | Settings affect gameplay & AI. |
| Save start/end; update stats/history | `backend/src/routes/**` | REST calls | 3 | History shows opponent, score, flags. |

---

## 4) How to Run

### 🧪 Development (Vite on :5173, Fastify on :3000)

```bash
# Terminal 1 — backend
cd backend
npm ci
npm run dev

# Terminal 2 — frontend
cd frontend
npm ci
npm run dev
````

Open: **[https://localhost:5173](https://localhost:5173)**

### 📦 Production / Evaluation (Docker, proxy on :443)

```bash
git clone <repo>
cd ft_transcendence
cp .env.example .env
docker-compose up --build
```

Open: **[https://localhost](https://localhost)**

**Services & Ports**

| Service  | Path        | Dev Port | Prod (via proxy) | Notes                             |
| -------- | ----------- | -------: | ---------------: | --------------------------------- |
| Backend  | `backend/`  |     3000 |       443 → 3000 | Fastify + SQLite; Socket.IO (WSS) |
| Frontend | `frontend/` |     5173 |     443 → static | TS SPA + Tailwind (Vite in dev)   |
| Proxy    | compose svc |        — |              443 | TLS termination; WS upgrade       |

**Required env vars**

| Var            | Where    | Example                                          | Purpose            |
| -------------- | -------- | ------------------------------------------------ | ------------------ |
| PORT           | backend  | 3000                                             | API port           |
| APP\_URL       | backend  | [https://localhost](https://localhost)           | CORS/cookie origin |
| JWT\_SECRET    | backend  | change\_me\_please                               | JWT sign/verify    |
| SQLITE\_PATH   | backend  | ./data/app.db                                    | DB file path       |
| TWOFA\_ISSUER  | backend  | ft\_transcendence                                | TOTP issuer        |
| VITE\_API\_URL | frontend | [https://localhost:3000](https://localhost:3000) | API base URL       |

---

## 5) Folder Structure

```
.
├─ backend/                 # Fastify backend (TypeScript)
│  ├─ src/
│  │  ├─ routes/            # REST API route handlers
│  │  ├─ db/                # DB schema/migrations (planned)
│  │  ├─ auth/              # Auth logic: JWT + 2FA (planned)
│  │  └─ main.ts            # Fastify entrypoint + sockets
│  ├─ Dockerfile            # Backend Dockerfile
│  ├─ package.json          # Backend deps + scripts
│  └─ tsconfig.json         # TypeScript config
│
├─ frontend/                # SPA (TypeScript + Tailwind + Vite)
│  ├─ src/
│  │  ├─ chat/              # Chat UI (planned)
│  │  ├─ settings/          # Game customization UI (planned)
│  │  ├─ game/              # Canvas, AI, logic (planned)
│  │  ├─ tournament/        # Tournament screens (planned)
│  │  ├─ ui/                # HUD, shared components (planned)
│  │  └─ main.ts            # SPA entry
│  ├─ index.html            # SPA host page
│  ├─ vite.config.ts        # Vite config
│  └─ tailwind.config.js    # Tailwind config
│
├─ docs/                    # Project docs
├─ docker-compose.yml       # One-command runner
├─ .env.example             # Example environment variables
└─ README.md                # This document
```

---

## 6) Compliance Checklist

* [x] TypeScript SPA (no frontend framework), Back/Forward works
* [x] Works in **Firefox** (mandatory) and Chrome (optional)
* [x] One Docker command from repo root
* [x] HTTPS + WSS everywhere
* [x] JWT in **HttpOnly, Secure, SameSite=Strict cookies** (not localStorage)
* [x] Passwords hashed (Argon2id or strong bcrypt)
* [x] Tournament supports alias-only + accounts
* [x] Remote players with reconnect safety
* [x] Live Chat: DM, block, invite, notifications
* [x] AI: keyboard simulation, refresh = 1s, same paddle speed, can win

---

## 7) Clarifications (Subject & Eval)

* Tournament: must work with only an alias (no login required).
* JWT: must not be stored in localStorage. Only in HttpOnly, Secure, SameSite=Strict cookies.
* 2FA: TOTP with authenticator app (QR enroll + code verify).
* AI: must simulate keyboard input, refresh its view every second, use same paddle speed, and use power-ups if present.
* Proxy: must terminate TLS (443) and forward WebSocket upgrade on `/socket.io`.
* Hard fails: secrets in git, missing `docker-compose.yml` at root, no HTTPS/WSS, SPA reloads instead of History API.

---

Crafted with teamwork by Alena, Luis & Sveva.
