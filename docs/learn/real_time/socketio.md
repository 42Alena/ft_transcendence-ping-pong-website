# 📡 Socket.IO – Beginner’s Guide (For All Ages)

## 🌐 What Is Socket.IO?

**Socket.IO** is a tool that lets your frontend and backend **talk to each other instantly** — without refreshing the page.

It uses **WebSockets** under the hood to send and receive messages in real time. That’s how we handle:
- 🏓 Paddle movements
- 💬 Live chat
- 🎮 Game events
- 👤 Online/offline presence

👉 Official site: [https://socket.io](https://socket.io)

---

## 💡 Why We Use Socket.IO in ft_transcendence

- ✅ Required for multiplayer Pong (real-time)
- ✅ Needed for live chat
- ✅ Works great with React and Fastify
- ✅ Allows bi-directional events (client ↔ server)

Without Socket.IO, you’d need to reload or poll every few seconds. With it, everything feels live.

---

## 🧩 How It Fits Into Our Architecture

- Frontend uses `socket.io-client`
- Backend uses `socket.io` with Fastify integration
- JWT token is used to authenticate the socket
- Messages are exchanged as events (not HTTP)

Example flow:
1. Player joins match → socket connects
2. Player presses key → socket emits movement
3. Server receives and broadcasts it to other player

---

## 🔁 Common Events We Use

- `connect`, `disconnect`
- `playerMove`, `ballUpdate`
- `chatMessage`, `blockUser`
- `matchInvite`, `gameOver`

Each event has a name and optional data.

---

## ⚙️ How a Socket Works

```js
// Frontend
socket.emit("chatMessage", { to: "friend", msg: "Hello!" });

// Backend
socket.on("chatMessage", (data) => {
  // validate and forward message
});

The server listens and responds to events using `socket.on`.

---

## 🔐 Auth with Socket.IO

- Client connects with token in query/header  
- Server reads and verifies JWT  
- If valid → allow socket connection  
- If invalid → reject socket  

You can add middleware to protect rooms or events.

---

## 🧪 Tips for Success

- Always clean up on `disconnect`  
- Avoid broadcasting to all unless needed  
- Validate data before broadcasting  
- Namespace events clearly (`game:move`, `chat:msg`)  
- Limit frequency of updates (throttle movement)  

---

## 📚 Learn More

- [socket.io Docs](https://socket.io/docs/v4/)  
- [Fastify + Socket.IO example](https://github.com/fastify/fastify-socket.io)  
- [WebSocket vs Socket.IO](https://ably.com/blog/websockets-vs-socket-io)  

---

✅ In ft_transcendence, Socket.IO powers our multiplayer game, real-time chat, and matchmaking. It connects everyone instantly.

> In short: **Socket.IO is the voice of our app — it sends messages live, fast, and in both directions.**
