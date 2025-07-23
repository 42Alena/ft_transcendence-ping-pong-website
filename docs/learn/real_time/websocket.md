# 🌐 WebSocket – Beginner’s Guide (For All Ages)

## 💡 What Is WebSocket?

**WebSocket** is a way for a browser and server to keep talking **live** — like a phone call that stays open.

It lets you send and receive data instantly without refreshing the page. This makes it perfect for games, chat apps, and real-time features.

👉 WebSocket is built into browsers and works great with libraries like `socket.io`.

---

## 🤝 How It Works

- Client opens a connection to the server  
- Connection stays open (not like HTTP which ends after 1 reply)  
- Client and server can now send messages back and forth at any time  

This is called **bi-directional communication**.

---

## 🏓 Why We Use WebSocket in ft_transcendence

- ✅ Real-time paddle movement (player input)  
- ✅ Ball syncing between players  
- ✅ Live chat messages  
- ✅ Match invites and online status  

Without WebSockets, our game would feel slow and laggy.

---

## 🛠️ WebSocket vs HTTP

| Feature          | HTTP            | WebSocket         |
|------------------|------------------|--------------------|
| One-time request | ✅ Yes           | ❌ No              |
| Stays connected  | ❌ No            | ✅ Yes             |
| Real-time data   | ❌ Not ideal     | ✅ Perfect         |
| Use case         | Login/API        | Game/Chat/Match    |

---

## ⚙️ How We Use WebSocket

We use WebSocket through **socket.io**:  
- Frontend connects with `socket.io-client`  
- Backend uses `socket.io` with Fastify  
- Connection includes auth (JWT)  
- We send custom events like `playerMove`, `chatMessage`, `matchInvite`

Example:

```ts
// Frontend
socket.emit("chatMessage", { to: "otherUser", text: "hi" });

// Backend
socket.on("chatMessage", (data) => {
  // validate + broadcast
});

## 🔐 Security in WebSocket

- ✅ Use JWT to authorize the socket connection  
- ✅ Validate every message (don’t trust client blindly)  
- ✅ Block users from sending to users they blocked  
- ✅ Disconnect sockets when user logs out or token expires  

---

## 🧠 Good Practices

- 🗂️ Keep a map of connected users (`userId → socketId`)  
- 🧹 Handle `disconnect` properly (update status)  
- 🧩 Prefix events like `chat:*`, `game:*`, `user:*`  
- 🚦 Don’t overload socket with too many messages per second  

---

## 📚 Learn More

- [WebSocket on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)  
- [Socket.IO Docs](https://socket.io/docs/v4/)  
- [WebSocket vs HTTP Explained](https://ably.com/blog/websockets-vs-http)  

---

✅ In ft_transcendence, WebSocket makes everything feel live — from chat to game.

> In short: **WebSocket is the heartbeat of our game — always on, always listening, always fast.**

