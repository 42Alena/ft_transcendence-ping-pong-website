# 👤 User Management – Beginner’s Guide (For All Ages)

## 🌐 What Is User Management?

**User management** is how we handle accounts in our app: registration, login, logout, profiles, avatars, and more.

It keeps track of who is using the app and makes sure each player has their own identity and data.

👉 It’s a required **major module** in ft_transcendence.

---

## 💡 Why We Need User Management in ft_transcendence

- ✅ Players must register/login to play and save stats  
- ✅ Needed for multiplayer invites, profiles, and chat  
- ✅ Helps protect features (only logged-in users can play or chat)  
- ✅ Makes match history and customization possible  

Without it, the game can’t track progress or protect users.

---

## 🔐 What User Info Do We Store?

- 📧 Email address  
- 🔑 Password (hashed with bcrypt!)  
- 🧑 Username or display name  
- 🖼️ Avatar image (optional)  
- 📈 Stats like wins/losses  
- 👯 Friends / blocked users  

Everything is saved in our SQLite database.

---

## 🧱 Key Features to Implement

- Register new users  
- Login with password (and 2FA if enabled)  
- Logout and destroy session/token  
- View/edit profile (name, avatar)  
- Fetch other user’s public info  
- Add/remove friends  
- Block/unblock users  

All of these use API routes secured with JWT.

---

## ⚙️ Where We Use User Info

- 🧠 Game: load your settings and apply them  
- 💬 Chat: show name/avatar, block logic  
- 🏓 Matchmaking: allow/deny invites based on friend/block  
- 🧾 Stats page: show match history  

We also use this data for leaderboard, online status, and more.

---

## 🧪 Tips for User Management

- ✅ Always hash passwords with `bcrypt`  
- ✅ Use JWT to verify identity on each request  
- ✅ Protect all routes (backend should never trust frontend alone)  
- ✅ Validate input: email format, password length, unique username  
- ✅ Add `.env` secrets to avoid hardcoded config  

---

## 📚 Learn More

- [Password Storage Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)  
- [JWT Intro](https://jwt.io/introduction)  
- [Fastify + Auth Example](https://github.com/fastify/fastify-example-twitter)  

---

✅ In ft_transcendence, user management gives each player a safe account and a way to connect with others.

> In short: **User management is how we give each player a name, a face, and a place in the game.**
