# 🐳 Docker – Beginner’s Guide (For All Ages)

## 🌐 What is Docker?

**Docker** is a tool that lets you run your entire app in a self-contained box called a **container**.

This box includes everything your app needs: code, libraries, runtime, system tools — so it works the same everywhere.

👉 Official site: [https://www.docker.com](https://www.docker.com)

You can think of Docker like a **magic backpack** 🎒. You put your whole project inside, and now you can carry and run it anywhere — and it always works the same.

---

## 💡 Why We Use Docker in ft_transcendence

- ✅ It’s required by subject ("must run in Docker")  
- ✅ Works on all machines (no setup issues)  
- ✅ Makes defense and testing easier  
- ✅ Packages frontend, backend, DB in one system  

Docker helps us avoid "it works on my computer" problems.

---

## 🧱 Key Concepts

- **Image**: A recipe that defines what’s inside (code + tools)  
- **Container**: A running version of an image (the live app)  
- **Dockerfile**: A file that tells Docker how to build the image  
- **Volumes**: Shared folders between host and container (e.g. for SQLite DB)  
- **Ports**: Access points to talk to the container (like 3000 → browser)  

---

## 🛠️ What Docker Does in Our Project

- Builds backend and frontend from source  
- Runs Fastify server + SQLite DB inside container  
- Serves frontend app (React or Vite build)  
- Connects containers with Docker Compose  

We don’t run anything directly — we run it **inside Docker**.

---

## 🧩 What’s in the Dockerfile

Our `Dockerfile` defines how to build and start a single container:
- Base image (like `node:18-alpine`)  
- Install dependencies  
- Copy code  
- Run build commands (like `npm run build`)  
- Start the app (`CMD` or `ENTRYPOINT`)  

Each part is like a layer in a sandwich 🥪

---

## 🚀 Common Docker Commands

```bash
# Build image from Dockerfile
docker build -t my-app .

# Run the app
docker run -p 3000:3000 my-app

# See running containers
docker ps

# Stop all containers
docker stop $(docker ps -q)

# Remove everything (careful!)
docker system prune -a
