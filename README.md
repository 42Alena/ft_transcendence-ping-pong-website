

# 🏓 ft_transcendence — Secure Pong Platform (SPA, HTTPS)



Final project of the **42 Berlin** Common Core curriculum.

After mastering **C, C++ and Bash**, we are building a **full-stack TypeScript single-page web application** centered around the classic **Pong** game, with secure user accounts, AI opponent, chat, statistics, GDPR compliance, and **HTTPS-only Dockerized deployment**.

---

## 🧭 Navigation

* [About 42 Berlin](#-about-42-berlin)
* [Team & Responsibilities](#-team--responsibilities)
* [Tech & Languages](#-tech--languages)
* [Project Overview](#-project-overview)
* [Architecture Overview](#-architecture-overview)
* [Modules (Subject-Compliant)](#-modules-subject-compliant)
* [Documentation](#-documentation)
* [Folder Structure](#-folder-structure-important-parts-only)
* [How to Run](#-how-to-run)
* [License](#-license)

---

## 🌍 About 42 Berlin

[42 Berlin](https://42berlin.de/) is part of the international **42 Network**, a project-based software engineering school.

Core principles:

* **No teachers, no lectures**
* **Self-learning & self-organization**
* **Peer-to-peer evaluation**
* **Real-world engineering challenges**

---

## 👥 Team — *“We Are trAScendeLs”*

|    | Member    | Role                                                                                                                                | GitHub                                               |
| -- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 🧩 | **Alena** | **Project Lead & Backend Architect** — system design, task planning, Fastify API, HTTPS setup, DB logic, managers, auth, chat, GDPR | [@42Alena](https://github.com/42Alena)               |
| 🎨 | **Sveva** | Game, Frontend & UX Lead — Canvas Pong, AI opponent, stats dashboards, responsiveness, accessibility                                | [@svevotti](https://github.com/svevotti)             |
| 🔐 | **Luis**  | Database & GDPR — initial schema design and data-protection concepts                                                                | [@Numbersdontlie](https://github.com/Numbersdontlie) |

> The project organization, module selection, and integration strategy were coordinated by **Alena**.

---

## 🛠 Tech & Languages

* **Languages:** TypeScript, HTML, CSS
* **Runtime:** Node.js
* **Backend:** Fastify (REST API, HTTPS)
* **Frontend:** TypeScript SPA + Tailwind CSS (no framework, History API)
* **Database:** SQLite (WAL mode, foreign keys enabled)
* **Security:** HTTPS only, hashed passwords, server-side validation, GDPR endpoints
* **Deployment:** Docker + Docker Compose

> ⚠️ **Important**
> This project uses **HTTPS exclusively**.
> There are **no WebSockets** — all communication happens via **secure HTTPS REST APIs**.

---

## 🌟 Project Overview

This project is a **production-style single-page web application** built around **Pong**.

It provides:

* 👤 **Secure user accounts** (register, login, profile, avatar)
* 🤖 **AI opponent** (keyboard-input simulation, subject-compliant)
* 💬 **Chat system** (direct messages, blocking, game invitations)
* 🏆 **Tournaments & matchmaking** (aliases or registered users)
* 📊 **User & game statistics dashboards**
* 🔐 **GDPR tools** (export, anonymize, delete account)
* 🎨 **Responsive UI** (desktop, tablet, mobile)
* 🚀 **One-command Docker startup with HTTPS**

**Mandatory constraints respected:**

* Single Page Application (History API)
* Browser back/forward navigation
* Firefox compatibility (also tested in Chrome)
* No unhandled console errors
* One-command Docker execution
* Secure HTTPS connection

---

## 🧱 Architecture Overview

The backend is structured around **clear responsibility managers**:

* **UserManager**
  Handles registration, login, profiles, avatars, friends, online status, and GDPR actions.

* **ChatManager**
  Manages direct messages, blocking logic, system notifications, and game invitations.

* **GameManager**
  Handles match lifecycle, tournaments, player aliases, AI integration, and statistics storage.

This separation keeps the system **maintainable, testable, and easy to explain during evaluation**.

---

## 📌 Modules (Subject-Compliant)

All modules below are **implemented, demonstrable**, and aligned with the official **ft_transcendence subject**.

| Module (exact subject name)                       | Lead  | Evidence                                           | Points |
| ------------------------------------------------- | ----- | -------------------------------------------------- | ------ |
| **Mandatory: SPA + Docker + HTTPS**               | All   | `docker-compose up --build`, HTTPS, SPA navigation | MUST   |
| **Web — Major: Backend framework (Fastify)**      | Alena | REST API, `/healthz`                               | 1.0    |
| **User Management — Major**                       | Alena | Accounts, profiles, match history                  | 1.0    |
| **Gameplay — Major: Live Chat**                   | Alena | DM, block, invites, notifications                  | 1.0    |
| **AI-Algo — Major: AI Opponent**                  | Sveva | AI can win, 1s refresh, keyboard simulation        | 1.0    |
| **Web — Minor: Frontend toolkit (Tailwind)**      | Sveva | Responsive UI                                      | 0.5    |
| **Web — Minor: Database (SQLite)**                | Alena | WAL, PRAGMAs, health route                         | 0.5    |
| **Cybersecurity — Minor: GDPR**                   | Alena | Export, anonymize, delete                          | 0.5    |
| **AI-Algo — Minor: User & Game Stats Dashboards** | Sveva | Charts, win/loss stats                             | 0.5    |
| **Accessibility — Minor: Support on all devices** | Sveva | Mobile/tablet/desktop layouts                      | 0.5    |
| **Accessibility — Minor: Browser compatibility**  | Sveva | Firefox + Chrome tested                            | 0.5    |

### 📊 Total

* **Majors:** 4.0
* **Minors:** 3.0
* **Total:** **7.0 (REQUIRED)** ✅

---

## 📘 Documentation

* [`docs/resources_used.md`](./docs/resources_used.md) — official references
* [`docs/policies/`](./docs/policies/) — validation & HTTP rules
* [`docs/learn/`](./docs/learn/) — beginner-friendly tech explanations
* [`docs/devlog/`](./docs/devlog/) — team development logs

---

## 🗂️ Folder Structure (important parts)

```
.
├─ backend/
│  ├─ db/            # SQLite, migrations, pragmas, health
│  ├─ src/
│  │  ├─ lib/Class/  # UserManager, ChatManager, GameManager
│  │  ├─ routes/     # REST API (users, chat, gdpr, health)
│  │  └─ main.ts     # Fastify entrypoint (HTTPS)
│  └─ Dockerfile
│
├─ frontend/
│  ├─ public/        # index.html, assets
│  ├─ src/           # SPA source (game, chat, profile, ui)
│  └─ Dockerfile
│
├─ docker-compose.yml
├─ Makefile
└─ README.md
```

---

## 🚀 How to Run (Evaluation / Production)

The project follows the **mandatory requirement**:
👉 **everything starts with ONE command**.

```bash
git clone <this-repo>
cd ft_transcendence
cp .env.example .env
docker-compose up --build
```

### 🌐 Open in browser

```
https://localhost:8443
```

> 🔒 The site uses **HTTPS with a self-signed certificate**.
> Click **Advanced → Proceed / Trust** in your browser.

### ℹ️ Internal services (Docker network only)

* Backend API → `http://backend:3000`
* Frontend server → `http://frontend:8080`

All public traffic goes through the HTTPS reverse proxy.

---

## 📄 License

MIT

---

