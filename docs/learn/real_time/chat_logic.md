# 💬 Chat Logic – Beginner’s Guide (For All Ages)

## 🌐 What Is Chat Logic?

Chat logic is the part of our project that lets users **talk to each other in real time**. It controls how messages are sent, received, displayed, and stored.

In ft_transcendence, we implement **Live Chat** as a major module. This feature makes our game more social and connected!

🧠 It’s not just about sending a message — we also support:
- Private messages (DMs)
- Blocking users
- Inviting someone to a match via chat
- Notifying players when a tournament is about to start

---

## 💡 Why Chat Is Important in ft_transcendence

- ✅ It’s required for our "Live Chat" module  
- ✅ It helps connect players before/after matches  
- ✅ It adds personality and interaction  
- ✅ It’s tested during evaluation  

Chat is **part of the player experience**, not just an extra.

---

## 🧩 How Chat Works in Our Architecture

Our chat system involves:

- **Frontend (React + Socket.io)**: Displays messages and sends user input  
- **Backend (Fastify + Socket.io)**: Handles logic, routing, and WebSocket events  
- **Database (SQLite)**: Optionally saves chat history or block lists  

We use **WebSockets** so that messages show up immediately — no reloads or polling needed.

---

## 🔁 The Flow of a Message

1. User types a message and hits send  
2. Message goes through WebSocket to backend  
3. Server validates it and sends it to the correct recipient(s)  
4. Receiver sees the message instantly on their screen  

Everything happens in less than 1 second! ⚡

---

## ✏️ Key Features We Implement

- ✅ **DMs**: One-to-one messages  
- ✅ **Block user**: Prevent someone from messaging you  
- ✅ **Invite to match**: Send a match invite via chat  
- ✅ **Tournament alerts**: Bot/system messages notify players of next match  

Optional:
- 🗃️ Save messages in DB (optional, not required)  
- 👀 View past messages in conversation view (if stored)  

---

## 🔐 Important Considerations

- Sanitize inputs to prevent code injection (e.g. `<script>`)  
- Prevent sending messages to blocked users  
- Respect privacy (don’t expose emails, internal IDs)  
- Show errors if chat fails  

---

## 🧪 Tips for Making a Good Chat Experience

- Auto-scroll to latest message  
- Highlight new messages  
- Show online/offline status  
- Use timestamps (hh:mm)  
- Use user-friendly formatting (bold, emoji, etc.)  

---

## 📚 Learn More

- [Socket.IO Chat Example](https://socket.io/get-started/chat/)  
- [Fastify WebSocket Plugin](https://github.com/fastify/fastify-websocket)  
- [Building Realtime Chat in React](https://www.freecodecamp.org/news/how-to-build-a-chat-app-with-react-and-socket-io/)  

---

✅ In ft_transcendence, our chat system creates a real sense of interaction. It turns players into a community and gives life to the game world.

> In short: **Chat logic is how our players talk, team up, and challenge each other — instantly, live, and socially.**
