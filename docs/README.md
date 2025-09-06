# 🏓 ft_transcendence

A real-time Pong web app with **secure auth (JWT + 2FA)**, **remote multiplayer** over **WSS**, **live chat**, **AI opponent**, and a **TypeScript SPA** (no frontend framework).  
Goal: **single Docker command** to run; must work in **Firefox** (also checked in Chrome).

---

## 📚 Menu

- [1) Project Description](#1-project-description)
- [2) Common Project Table (Main + 7 modules)](#2-common-project-table-main--7-modules)
- [3) Our Roles (combined overview + detailed tasks)](#3-our-roles-combined-overview--detailed-tasks)
- [4) How to Run](#4-how-to-run)
- [5) Folder Structure (commented)](#5-folder-structure-commented)
- [6) Quick Compliance Checklist](#6-quick-compliance-checklist)
- [7) Troubleshooting (fast)](#7-troubleshooting-fast)
- [8) Important Clarifications (Subject/Eval)](#8-important-clarifications-subjecteval)

---

## 1) Project Description

### What it is
Multiplayer **Pong** in the browser with **live chat**, **tournaments (supports alias-only or accounts)**, **AI**, and **user profiles/stats**—delivered as a **single-page app** that evaluators can start with **one Docker command**.

### How it works
- **Frontend (no framework):** Vanilla **TypeScript** + **Tailwind**. SPA navigation uses the **History API** (Back/Forward works; no full page reloads).  
- **Backend:** **Fastify** (Node.js) + **SQLite** provide REST APIs and **Socket.IO** for realtime (**WSS** in prod).  
- **Realtime model:** One **Socket.IO room per match**. Inputs are client → server; the server relays authoritative state snapshots and handles reconnects (pause → rejoin → catch-up state).  
- **Security:** End-to-end **HTTPS/WSS**, **JWT** in **HttpOnly, Secure, SameSite=strict cookies** (no `localStorage`), server-side validation/sanitization, **Argon2id** password hashing (or bcrypt with strong cost), and **secrets only in `.env`**.

---

## 2) Common Project Table (Main + 7 modules)

| Item | Who | Paths | Language / Tools | Priority | Notes (deliverables & acceptance) |
|---|---|---|---|---:|---|
| **MAIN (SPA, Docker, HTTPS/WSS)** | All | `frontend/`, root `docker-compose.yml` | TypeScript SPA, Nginx/Caddy proxy | **1** | **Deliverables:** SPA with History API; `docker-compose.yml` at repo root; proxy TLS + WSS; tournament supports **alias-only** (no account) and account mode. **Accept:** Back/Forward doesn’t reload; `docker-compose up --build` boots all; alias flow works standalone. |
| **Fastify backend (Major)** | Luis | `backend/{luis_* , src}` | Fastify + SQLite | **2** | **Deliverables:** REST routes + JSON schemas; DB bootstrap; `/healthz`. **Accept:** Endpoints 2xx/4xx correctly; schema validation enforced. |
| **User Management (Major)** | Sveva (+Luis) | `frontend/`, `backend/` | TS + Fastify | **3** | **Deliverables:** Register/Login, Profile (avatar), Friends+Online, Stats/History. **Accept:** Create user, login, see profile, add friend, view history. |
| **2FA + JWT (Major)** | Luis | `backend/luis_auth` | jsonwebtoken, **TOTP (authenticator app)** | **4** | **Deliverables:** **TOTP** enrollment (QR), verification, short-lived JWT in **HttpOnly** cookie, protected routes. **Accept:** No JWT → 401; wrong TOTP → 401; valid TOTP → JWT issued; protected routes require cookie. |
| **Remote Players (Major)** | Alena | `backend/alena_socketio` | Socket.IO over WSS | **5** | **Deliverables:** Rooms; paddle/ball/score sync; reconnect safety. **Accept:** Second browser joins same match; inputs mirror; disconnect → pause; reconnect → resume with state. |
| **Live Chat (Major)** | Alena | `frontend/alena_chat_ui` | Socket.IO + TS UI | **6** | **Deliverables:** DMs, block, invite to game, profile links, tourney notices. **Accept:** Block prevents messages; invite creates/joinable match; notifications appear. |
| **Tailwind + Customization (2 Minors)** | Alena | `frontend/alena_customization_ui` | Tailwind + TS | **7** | **Deliverables:** Settings UI (speed, paddle size, power-ups, modes); default preset; persist/sync. **Accept:** Settings change gameplay/AI consistently (local & remote). |
| **AI Opponent (Major)** | Sveva | `game/sveva_ai`, `game/logic` | TS + Canvas | **8** | **Deliverables:** AI obeys **3 hard constraints** (see below). **Accept:** Human vs AI playable; AI sometimes wins; **no teleport**; view **refresh = 1 s**; **same paddle speed**; uses power-ups. |

> **AI – 3 hard constraints (explicit):**  
> 1) **Keyboard Simulation Only** (never set paddle position directly).  
> 2) **View Refresh = 1 second** (predict bounces between refreshes).  
> 3) **Same paddle speed** as humans (no cheating); if power-ups exist, **AI uses them**.

---

## 3) Our Roles (combined overview + detailed tasks)

### 3.1 Common team tasks (all)
- Keep **contracts** in `shared/` (socket events, DTOs, constants) in sync.  
- Branch → PR → review; atomic commits with clear messages.  
- Maintain **.env.example**; never commit secrets; test **Firefox + Chrome**.  
- Ensure **SPA Back/Forward** works; no full reloads.  
- Keep **Docker** stacks reproducible; **one-command** run from repo root.

### 3.2 Roles overview (who does what + tools)

| Person | Role | Detailed Steps (high level) | Language / Programs |
|---|---|---|---|
| **Alena** | Real-Time Systems Lead | Socket layer (JWT handshake, rooms, events, reconnect policy), remote sync (paddle/ball/score), **Live Chat** (DM, block, invite, notices), **Tailwind + Game Customization UI**, shared contracts. | **TypeScript**, **Socket.IO**, **Tailwind**, Vite (dev), **Docker Compose** |
| **Luis** | Backend & Auth Lead | Fastify bootstrap, SQLite schema/migrations, REST (auth/2FA, me, matches, friends, history), **JWT in HttpOnly cookie**, **TOTP 2FA**, WS auth, `.env` loader + docs, **Argon2id** hashing. | **TypeScript**, **Fastify**, **SQLite**, **Argon2id/bcrypt**, **jsonwebtoken**, **otplib**, **Socket.IO** (server) |
| **Sveva** | Game Logic & AI Lead | Canvas loop (local 2P), physics/collisions, **Tournament** (alias, bracket, next-match events), **AI** (keyboard sim, 1s refresh, predictive, same speed, can win, uses power-ups), apply customization, save results + stats. | **TypeScript**, Canvas API, game math, **Socket.IO** (client), REST/Fetch |

### 3.3 Detailed task tables (per person)

#### 👤 Alena — Real-Time Systems Lead
| Task | Path | Language / Tools | Priority | Notes (acceptance) |
|---|---|---|---:|---|
| JWT handshake & `socket.data.userId` | `backend/alena_socketio` | Socket.IO, TS | 5 | Server rejects invalid JWT; accepted sockets carry `userId`. |
| Match rooms (join/leave; lifecycle) | `backend/alena_socketio` | Socket.IO | 5 | `match.join/leave`; room membership tracked; leave cleans up timers. |
| Paddle/ball/score sync (throttled; timestamps) | `backend/alena_socketio` | Socket.IO | 5 | Opponent sees paddle quickly; ball snapshots rate-limited; timestamps monotonic. |
| Reconnect policy (pause → rejoin → catch-up) | `backend/alena_socketio` | Socket.IO | 5 | Disconnect triggers pause; reconnect resends authoritative state. |
| Live Chat (DM/block/invite/notices/profile links) | `frontend/alena_chat_ui` | TS + Tailwind | 6 | Blocked sender cannot DM; invite opens join dialog; usernames link to profiles. |
| Tailwind base + HUD components | `frontend/style` | Tailwind | 7 | Consistent spacing/typography; responsive HUD. |
| Settings UI (speed/paddle/power-ups/modes; presets) | `frontend/alena_customization_ui` | TS + Tailwind | 7 | Changing settings affects gameplay in local & remote; AI picks them up. |
| Maintain `shared/events.ts`, `types.ts`, `constants.ts` | `shared/*` | TS | 7 | Versioned event names; coordinated changes across teams. |

#### 🔒 Luis — Backend & Auth Lead
| Task | Path | Language / Tools | Priority | Notes (acceptance) |
|---|---|---|---:|---|
| Fastify bootstrap (CORS, errors, logging) | `backend/src` | Fastify + TS | 2 | `/healthz` 200; CORS matches `APP_URL`; structured logs. |
| SQLite schema + migrations bootstrap | `backend/luis_db` | better-sqlite3 | 2 | Tables created on first run; idempotent. |
| REST routes: auth/2FA, `/me`, matches (start/end/history), friends | `backend/luis_routes` | Fastify | 2 | JSON schema validation; clean 4xx; (optionally) paginate history. |
| **Argon2id** password hashing | `backend/luis_auth` | argon2/bcrypt | 4 | Strong hashing; configurable params; verified on login. |
| JWT issue/verify → **HttpOnly cookie** | `backend/luis_auth` | jsonwebtoken | 4 | Set `HttpOnly; Secure; SameSite=Strict`; short expiry (e.g., 1h). |
| **TOTP 2FA** enroll/verify (QR) | `backend/luis_auth` | otplib | 4 | Enroll with QR; verify code before JWT issuance. |
| WS auth (verify JWT in handshake; expose `userId`) | `backend/src` | Fastify + Socket.IO | 4 | Missing/invalid token → refused; `socket.data.userId` available. |
| `.env` loader + required vars doc | `backend/` | dotenv | 2 | Fails fast with helpful error if critical env missing. |

#### 🎮 Sveva — Game Logic & AI Lead
| Task | Path | Language / Tools | Priority | Notes (acceptance) |
|---|---|---|---:|---|
| Canvas loop + local 2-player | `frontend/sveva_game_canvas` | TS + Canvas | 1 | Two paddles on one keyboard; 60fps draw; scoring correct. |
| Physics & collisions (deterministic tick) | `game/logic` | TS | 1 | Same inputs → same results; no tunneling at fast speed. |
| Tournament: **alias-only** + bracket + next-match events | `game/sveva_tournament` | TS (+ sockets) | 3 | Alias flow works without accounts; “next match” event notifies room. |
| AI: **keyboard sim**, **1s refresh**, prediction, **same speed**, can win, uses power-ups | `game/sveva_ai` | TS | 8 | Meets the 3 hard constraints; human vs AI playable. |
| Apply customization to physics & AI | `game/*` | TS | 7 | Speed/paddle/modes affect physics and AI consistently. |
| Save start/end; update stats/history | `backend/luis_routes` | REST calls | 3 | Match stored with settings; history shows opponent, score, date, AI/remote flag. |

---

## 4) How to Run

Evaluation (production-like)
1) Copy envs:
   cp .env.example .env
2) From repo root, start everything:
   docker-compose up --build
3) Open: https://localhost  (proxy handles TLS + WSS)

Smoke test steps
- Open two browsers (or one private window).
- Create users → login (TOTP 2FA if enabled).
- From Chat, invite the second user → both join a match room.
- Move paddles; confirm opponent sees updates.
- Disconnect one tab → match pauses → reconnect → resumes with same state.
- Start AI match; confirm 1 s refresh and AI can sometimes win.
- Check Profile → history shows last match with scores & flags.

Dev (hot-reload)
Terminal A: backend
  cd backend && npm ci && npm run dev
Terminal B: frontend
  cd frontend && npm ci && npm run dev

Services & Ports
Service   | Path / Defined in | Dev Port | Prod (via proxy) | Notes
Backend   | backend/          | 3000     | 443 → 3000       | Fastify + SQLite; Socket.IO server (WSS via proxy)
Frontend  | frontend/         | 5173     | 443 → static     | TypeScript SPA + Tailwind (no FE framework), Vite in dev
Proxy     | in compose        | —        | 443              | TLS termination, WebSocket upgrade on /socket.io

Required env vars
Var            | Where    | Example                   | Purpose
PORT           | backend  | 3000                      | API port (behind proxy)
APP_URL        | backend  | https://localhost         | CORS/cookie origin
JWT_SECRET     | backend  | change_me_please          | Sign/verify JWT
SQLITE_PATH    | backend  | ./data/app.db             | DB file path
TWOFA_ISSUER   | backend  | ft_transcendence          | TOTP issuer label
VITE_API_URL   | frontend | https://localhost:3000    | API base URL

Note: Keep .env.example at repo root; never commit secrets.

--------------------------------------------------------------------

## 5) Folder Structure (commented)

.
├─ backend/                                  — Fastify API + Socket.IO server (Node/TS)
│  ├─ alena_socketio/                        — Real-time: rooms, events, reconnect, throttled state
│  ├─ luis_auth/                             — JWT/Argon2id, TOTP enroll/verify, hooks
│  ├─ luis_db/                               — SQLite schema, migrations/bootstrap, queries
│  ├─ luis_routes/                           — HTTP routes (auth/me/matches/friends) + validation
│  ├─ src/                                   — Backend bootstrap & server utilities
│  │  ├─ index.ts                            — Fastify entry (plugins, routes, start)
│  │  ├─ plugins/                            — CORS, logger, rate-limit, helmet, etc.
│  │  └─ ws.ts                               — Socket.IO wiring (JWT handshake → socket.data.user)
│  ├─ Dockerfile                             — Backend container build
│  ├─ .dockerignore                          — Exclude local files from image
│  ├─ package.json                           — Backend scripts/deps
│  └─ tsconfig.json                          — TypeScript config
│
├─ frontend/                                 — TypeScript SPA (no FE framework) + Tailwind + Vite
│  ├─ alena_chat_ui/                         — Chat UI (DM, block, invite, tourney notifications)
│  ├─ alena_customization_ui/                — Settings UI (speed, paddle, power-ups, modes)
│  ├─ sveva_game_canvas/                     — Canvas game shell (local 2-player; HUD; input)
│  ├─ src/                                   — SPA host code (routing, pages, API client)
│  │  ├─ main.ts                             — SPA entry (mount app; router/state)
│  │  ├─ router.ts                           — History API routes (Back/Forward)
│  │  └─ pages/                              — Login, Profile, Match, Tournament, NotFound
│  ├─ style/                                 — Tailwind base/components/utilities; global CSS
│  ├─ index.html                             — Single page host (Vite)
│  ├─ vite.config.ts                         — Vite config (dev server, HTTPS in dev)
│  ├─ tailwind.config.js / postcss.config.js — Tailwind build pipeline
│  ├─ package.json / tsconfig.json           — Frontend scripts/config
│
├─ game/                                     — Framework-free domain code
│  ├─ logic/                                 — Physics: movement, collisions, scoring, tick
│  ├─ sveva_ai/                              — AI controller (keyboard simulation, 1 s refresh)
│  └─ sveva_tournament/                      — Alias entry, bracket, next-match flow
│
├─ shared/                                   — Contracts & assets used by both sides
│  ├─ assets/                                — Images/icons
│  ├─ api_routes.md                          — REST contract (endpoints, payloads)
│  ├─ events.ts                              — Socket event names & payload types (C↔S)
│  ├─ constants.ts                           — Tick rate, speeds, paddle sizes
│  └─ types.ts                               — Shared DTOs (User, Match, Message, etc.)
│
├─ docker-compose.yml                        — One-command runner (proxy TLS + backend + frontend)
├─ .env.example                              — Example env variables (copy to .env locally)
└─ README.md                                 — This document

--------------------------------------------------------------------

## 6) Quick Compliance Checklist

- TypeScript SPA (no frontend framework), Back/Forward works
- Firefox compatible (also checked on Chrome)
- One Docker command from repo root (compose at root)
- HTTPS everywhere • WSS for sockets • no secrets in git
- Tournament supports alias-only (no account) and account modes
- Remote players with reconnect safety
- Live Chat: DM, block, invite, notifications
- AI: keyboard-sim, 1 s refresh, same paddle speed, can win, uses power-ups
- Security: JWT in HttpOnly cookies, Argon2id hashing, strict validation

--------------------------------------------------------------------

## 7) Troubleshooting (fast)

WSS fails / mixed content
- Proxy must terminate TLS and forward WebSocket upgrade on /socket.io.
- Ensure VITE_API_URL=https://localhost:3000 and SPA served via https.

401 Unauthorized on sockets
- Client must send JWT cookie; or include token in handshake; server verifies and sets socket.data.userId.

CORS / cookies
- APP_URL must match SPA origin (scheme + host + port). Set cookies with Secure; SameSite=Strict.

SQLite permissions
- Ensure the container user can write to SQLITE_PATH; mount a volume if needed.

Back/Forward doesn’t work
- Use History API routes; proxy must rewrite unknown paths to index.html.

High latency / jitter
- Lower ball.state frequency; timestamp snapshots; reconcile on client.

--------------------------------------------------------------------

## 8) Important Clarifications (Subject/Eval)

- Alias-only Tournament: Even with user accounts, the tournament must work with just an alias. Clear alias flow in UI (no login required).
- JWT Storage: Do NOT use localStorage. Tokens are HttpOnly, Secure, SameSite=strict cookies.
- Password Hashing: Use Argon2id (preferred) or strong-cost bcrypt.
- AI Constraints: Keyboard simulation only; view refresh = 1 s; same paddle speed; uses power-ups.
- Socket.IO Policy: Socket.IO is only transport (rooms, delivery). Game logic, lag/reconnect policy, and authority are our own.
- Browsers: Subject requires Firefox; evaluators may use Chrome — we test both.
- Hard Fails: No secrets in git; docker-compose.yml at repo root; evaluation starts with "docker-compose up --build".

--------------------------------------------------------------------

Built with ❤️ by Alena, Luis, and Sveva.

