# 📘 Fastify – Beginner’s Guide (For All Ages)

## 🌐 What is Fastify?

Fastify is like the engine of a smart robot 🧠 — it helps our project talk to players, store information, and respond super fast. It’s a special tool built with **Node.js** that makes websites and apps run fast and smoothly.

It’s especially good when you want to:
- Build your own login system
- Create routes like `/chat` or `/play`
- Talk to a database (like SQLite)
- Keep your backend clean, safe, and structured

👉 Official site: [https://www.fastify.io](https://www.fastify.io)

---

## 💡 Why Fastify Is Awesome

- 🏎️ Super fast (even faster than Express.js)
- 🧱 Modular (you can build it like LEGO blocks)
- 📦 Plugin system for clean organization
- 🛡️ Built-in validation and error handling
- 🎓 Beginner-friendly, but powerful for pros

---

## 🧠 Why We Use Fastify in ft_transcendence

Our project needs a **backend** — something that listens for requests and sends data back. Fastify is our best choice because:

- ✅ It’s officially allowed in the subject (Fastify module)
- ✅ It works great with JWT and 2FA (auth module)
- ✅ It connects to SQLite (database module)
- ✅ It supports WebSockets (chat, game sync)
- ✅ It’s easy to write, test, and debug

---

## 🧩 What Fastify Does in Our Architecture

Fastify is the “server” part of our project — it connects everything behind the scenes:

- Frontend (user screen) sends requests ➡️ Fastify
- Fastify checks tokens, reads/writes data ➡️ SQLite
- Sends responses and messages back ➡️ frontend
- Works with sockets for real-time chat/game

Imagine it like the brain and message center 📡 — keeping everyone in sync.

---

## 🚀 What We Build with Fastify

- 🔐 Auth routes: login, register, profile
- 🧑‍🤝‍🧑 User routes: stats, friend list
- 🏓 Game routes: match setup, results
- 💬 Chat routes: message, block, invite
- 🔗 Socket server: sync paddle/ball, broadcast game

Each one is a **route** or a **plugin** that Fastify runs for us.

---

## 🧼 How We Keep Things Secure

- We use **JWT tokens** to verify users
- We protect routes using `preHandler` functions
- We hash passwords with `bcrypt`
- We validate input using JSON schema

Fastify makes it easy to lock things down 🔐 and avoid bugs or attackers.

---

## 🧠 What to Know as a Developer

- Routes = pages or endpoints
- Plugins = bundles of related routes/features
- Middleware = checks that run before a request finishes
- Decorators = helper functions you can reuse (like `authenticate`)

---

## 🧪 Tips and Good Habits

- Organize routes by folder: `/auth`, `/chat`, `/game`
- Always check inputs and token
- Use `try/catch` for all async logic
- Keep plugin files small and focused

---

## 📚 Learn More About Fastify

- 🔗 [Official Docs](https://www.fastify.io/docs/latest/)
- 🔗 [Awesome Fastify](https://github.com/fastify/awesome-fastify)
- 🔗 [Plugins Directory](https://www.fastify.io/ecosystem)

---

✅ Fastify is perfect for ft_transcendence because it's fast, modular, and safe — just like our project needs. It’s the **engine** of our backend: powering users, chat, matches, and real-time gameplay.

> In short: **Fastify is our project's nervous system — it listens, responds, and keeps everything running fast and secure.**
