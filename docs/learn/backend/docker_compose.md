# 🐳 Docker Compose – Beginner’s Guide (For All Ages)

## 🌐 What is Docker Compose?

**Docker Compose** is a tool that lets us run many services together — like a full-stack app — using a single file and one command.

In ft_transcendence, we use Docker Compose to run everything:
- The frontend (React/Vite)
- The backend (Fastify API)
- The database (SQLite file mounted)

👉 Official site: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)

---

## 🧱 Why Use Docker Compose in Our Project?

- ✅ Required by subject ("must launch with a single command")  
- ✅ Makes development portable (runs the same on every machine)  
- ✅ Simplifies setup for evaluation  
- ✅ Works well with `.env` files (credentials & secrets)  

It’s like a blueprint that tells Docker how to build and connect all the pieces of our app 🔧

---

## 📄 What Is docker-compose.yml?

It’s a special file that describes:
- What containers we need  
- What commands they run  
- Which ports they expose  
- How they share volumes (like SQLite file)  

Example services:
- `frontend` → builds and serves the game UI  
- `backend` → runs the Fastify server  
- `db-volume` → mounts persistent data if needed  

---

## 🚀 One Command to Launch Everything

In terminal, just run:

```bash
docker-compose up --build
