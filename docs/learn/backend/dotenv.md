# 🔐 Dotenv – Beginner’s Guide (For All Ages)

## 🌐 What is Dotenv?

**Dotenv** is a tiny tool that lets us keep all our **secret settings** (like passwords, tokens, and ports) in a safe file called `.env` — instead of writing them directly in the code.

It works by loading variables into `process.env` so they can be accessed anywhere in your Node.js app.

👉 Official repo: [https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)

---

## 💡 Why We Use dotenv in ft_transcendence

- ✅ The subject says secrets must be in `.env` (evaluation rule)  
- ✅ Keeps secrets out of source code  
- ✅ Works perfectly with Docker, Fastify, JWT, and database settings  
- ✅ Lets us change settings without touching the code  

For example, we can store:
- `JWT_SECRET`  
- `DATABASE_URL`  
- `PORT=3000`  

---

## 📁 What is a `.env` File?

It’s a simple text file that looks like this:

PORT=3000
JWT_SECRET=mySuperSecretToken123
DB_FILE=./data/database.sqlite


Each line is a key=value pair. No quotes, no semicolons, just simple.

> ⚠️ Never commit your `.env` to GitHub — always add it to `.gitignore`

---

## ⚙️ How It Works in Code

You use the `dotenv` package like this:

```js
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;
const secret = process.env.JWT_SECRET;

Now your app uses the settings from `.env`, without hardcoding them.

---

## 🧩 Where We Use It in Our Project

- **Backend**: loads JWT secret, DB path, 2FA config  
- **Docker**: uses env file with `env_file:` setting  
- **WebSocket**: maybe sets allowed origins, port  

All services share settings through one clean `.env` file.

---

## 🧪 Tips and Good Practices

- ✅ Always add `.env` to `.gitignore`  
- ✅ Use clear and descriptive variable names (e.g. `APP_PORT`, `FRONTEND_URL`)  
- ✅ Load early in your app (`dotenv.config()` at the top)  
- ✅ Don’t put comments in `.env` (some parsers break)  

---

## 📚 Learn More

- [dotenv GitHub](https://github.com/motdotla/dotenv)  
- [12-Factor App Config](https://12factor.net/config)  
- [Environment Variables Guide](https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/)  

---

✅ In ft_transcendence, dotenv helps us stay secure, flexible, and ready for evaluation. All settings live in one safe place.

> In short: **dotenv is our secret keeper — it keeps passwords and settings out of our code and safe from leaks.**

