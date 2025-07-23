# 📘 SQLite – Beginner’s Guide (For All Ages)

## 🌐 What is SQLite?
Imagine you have a magical notebook 📓 that remembers everything you write into it — names, scores, chats, and more. That’s what **SQLite** is like for our project.

SQLite is a **tiny, powerful memory box** that helps your program remember important information — just like a brain! Unlike other databases, you don’t need to set up a big server. You only need one file, and it works out of the box.

👉 Official site: [https://www.sqlite.org](https://www.sqlite.org)

### 🔍 Why SQLite is Special:
- 🧳 It fits into a single file  
- 🛠️ No installation or server needed  
- 💾 It saves things on your computer, not in the cloud  
- 🧠 You use normal sentences (called SQL) to talk to it  
- 🧸 Easy to learn and perfect for small projects  

SQLite is like using a personal notebook instead of a big company filing cabinet. It’s yours, it’s close, and it’s simple.

---

## 🧠 Why We Use SQLite in ft_transcendence
In our Pong project, we need to save lots of things: users, scores, friends...

We picked SQLite because:
- ✅ It's officially allowed in the subject  
- ✅ It works great inside our Docker container  
- ✅ It doesn't need internet or setup — just works!  
- ✅ It's fast and perfect for one small game server  
- ✅ It talks well with Fastify (our backend tool)  

---

## 🗃️ What We Store in SQLite
Think of it like organized boxes with labels. We store:
- 👤 Players: name, email, avatar  
- 🏓 Matches: who played, score, date  
- 🛠️ Settings: game mode, power-ups, etc.  
- 🗨️ Chat (optional): messages sent during the game  
- 👫 Friends: who added who  

It’s all saved inside one `.sqlite` file, like a big backpack of memories 🎒.

---

## 🧩 How It Fits Into Our Architecture
Here’s how SQLite works with our tools:
- The **backend** (Fastify) reads/writes info in SQLite  
- Every time someone logs in, plays a game, or chats — it’s stored there  
- It works inside our Docker container with no internet needed  
- Our API sends info between frontend ↔️ Fastify ↔️ SQLite  

SQLite is like the library where all the facts of the game are stored 📚

---

## ⚙️ How SQLite is Used in Our Code (Simple Idea)
Even without showing code, here’s what happens:
- We ask: “What’s the score of user A?” → SQLite gives us the answer  
- We say: “Save this new user” → SQLite writes it down  
- We use sentences called **SQL** like:  
  - `SELECT * FROM users`  
  - `INSERT INTO matches (player1, player2, score) VALUES (...)`  
- We use a tool called `better-sqlite3` to do this from Fastify  

---

## 🧪 Tips and Good Habits
- 🧼 Always check user input before saving it  
- 🧮 Use smart labels (indexes) so it’s quick to find things  
- 💾 Make backups (copy your `.sqlite` file somewhere safe)  
- 🧠 Keep your data clean and tidy  

---

## 📚 Learn SQLite Easily
- 🔗 [Official website](https://www.sqlite.org)  
- 🔗 [Quick Start](https://www.sqlite.org/quickstart.html)  
- 🔗 [Online playground](https://sqliteonline.com)  
- 🔗 [Tutorials](https://www.sqlitetutorial.net)  

If you like building with LEGO or Minecraft, you’ll like SQLite — it’s the same idea but for saving real things in your project.

---

✅ SQLite is our game’s notebook. It remembers users, scores, chats, and settings — without needing a server. It’s safe, simple, and works inside our app.

> In short: **SQLite is our Pong project's brain. It stores everything — quickly and quietly — so we can play, save, and keep score.**
