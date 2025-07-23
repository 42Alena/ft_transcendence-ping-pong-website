# 🗂️ .env Files – Beginner’s Guide (For All Ages)

## 🌐 What Is a `.env` File?

A `.env` file is a simple text file that stores **environment variables** — like passwords, ports, secret keys, and other config — in one place.

It helps keep our code clean and secure by **moving sensitive values out of the source code**.

👉 It works together with tools like `dotenv`, Docker, and most frameworks.

---

## 📦 What Do We Put in a .env File?

```env
PORT=3000
JWT_SECRET=mySecretKey123
DB_FILE=./data/database.sqlite
FRONTEND_URL=http://localhost:3000

Each line is a variable and its value, separated by `=`.  
No spaces, no quotes, no commas.

Variables are later accessed in code using `process.env.PORT`, etc.

---

## 🧠 Why .env Files Are Useful in ft_transcendence

- ✅ Required by subject rules (no hardcoded secrets)  
- ✅ Needed for Docker (`env_file:`)  
- ✅ Used in Fastify backend (JWT, DB path)  
- ✅ Keeps your app flexible (change config without touching code)  
- ✅ Prevents leaking private info in public Git repos  

---

## 📁 Where .env Files Are Used

| File               | Purpose                                  |
|--------------------|-------------------------------------------|
| `.env`             | Main config (ports, secrets, DB path)     |
| `.env.production`  | For production deployments (real domain)  |
| `.env.development` | For local testing (localhost, debug keys) |

Most projects just use `.env`, but you can have one per environment.

---

## 🛑 What Should NOT Be in Git

You **must not** upload your `.env` file to GitHub. Ever.

Add this to your `.gitignore`:

.env
.env.*


This prevents accidental leaks of secrets.

---

## 🛠️ How to Use a .env File

- In Node.js: use the `dotenv` package  
- In Docker Compose: use `env_file: .env`  
- In shell: run with `source .env` (Linux/macOS)

**Example with `dotenv`:**

```js
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.JWT_SECRET);


## ✅ Best Practices

- Keep `.env` in the root of your project  
- Add it to `.gitignore`  
- Name variables clearly: `FRONTEND_URL`, `DB_PATH`, `JWT_SECRET`  
- Use separate files for dev and production if needed  
- Keep backup copies of production secrets somewhere safe  

---

## 📚 Learn More

- [12 Factor App Config](https://12factor.net/config)  
- [dotenv GitHub](https://github.com/motdotla/dotenv)  
- [Environment Variables in Node.js](https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/)  

---

✅ In ft_transcendence, `.env` files are essential for security, flexibility, and evaluation. All secrets and ports live here — not in the code.

> In short: **`.env` files are our secret notebook — invisible to Git, but visible to our app.**
