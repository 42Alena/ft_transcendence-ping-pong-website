# 🔐 JWT – Beginner’s Guide (For All Ages)

## 🌐 What is JWT?

**JWT** stands for **JSON Web Token**. It’s a way to **safely prove who you are** when talking to a server.

Instead of logging in over and over, your app gets a **signed token** — a special string that says: “Hey, I’m User123 and I’m allowed to do this.”

👉 Official spec: [https://jwt.io](https://jwt.io)

It works like a **passport** — you show it each time, and the server checks your identity.

---

## 🧠 Why We Use JWT in ft_transcendence

- ✅ Required by our chosen 2FA + JWT module  
- ✅ Helps protect routes (profile, match, chat)  
- ✅ Keeps users logged in across pages  
- ✅ Used with 2FA and socket auth  

JWT is simple, secure, and works great with Fastify.

---

## 🔐 What’s Inside a JWT?

A JWT has three parts:

1. **Header** – says what kind of token it is  
2. **Payload** – contains data like user ID, name, roles  
3. **Signature** – proves it hasn’t been tampered with  

Example payload:

```json
{
  "id": 42,
  "username": "pongMaster",
  "isAdmin": false
}
