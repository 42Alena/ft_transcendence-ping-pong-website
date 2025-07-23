# 🛡️ Security Rules – Guide for ft_transcendence

## 🔐 Why Security Matters

Even in a small game project like ft_transcendence, protecting user data and preventing abuse is important — especially since we handle:
- 🧑‍💼 Registered accounts
- 🔑 Passwords + JWT tokens
- 🔒 2FA codes
- 💬 Live chat and friend invites

Neglecting basic security can lead to leaked credentials, broken game logic, or vulnerability during evaluation.

---

## ✅ Rules You MUST Follow (per subject + good practice)

### 1. Never Store Passwords in Plain Text
- Always hash passwords with `bcrypt`
- Store only the hashed version in SQLite

### 2. Use Environment Variables for Secrets
- JWT secrets, 2FA keys, DB paths go in `.env`
- Never hardcode secrets or expose them to frontend

### 3. Sanitize All Input
- On both frontend and backend
- Prevent code injection in chat (`<script>` tags)
- Escape special characters in usernames/messages

### 4. Secure API Routes
- Use JWT middleware to protect routes
- Add checks like `isLoggedIn`, `isOwner`, `isFriend` where needed
- Don’t let anyone access user data without auth

### 5. Validate Everything
- Check emails, passwords, usernames, etc.
- Enforce length, format, character limits
- Always reject malformed or too-large input

### 6. Rate Limit or Throttle (Optional but Smart)
- Prevent brute force (especially on login, 2FA)
- Limit number of chat messages per second

### 7. Use HTTPS in Production
- Use reverse proxy (e.g. NGINX) with SSL
- Don’t transmit tokens or credentials in plain text

---

## 🔒 Socket & Chat Security

- Authenticate users before opening socket connection
- Send JWT in handshake or auth payload
- Validate all messages (sender, content, type)
- Block messages to/from users you blocked

---

## 🚫 What to Avoid

- ❌ Logging raw passwords or secrets
- ❌ Sending 2FA codes over chat or console
- ❌ Trusting frontend-only validation
- ❌ Letting one user access another’s match/data
- ❌ Using predictable user IDs in URLs

---

## 🧪 How to Test Your Security

- Try injecting HTML in messages (see if it's escaped)
- Try accessing protected API routes without logging in
- Try brute-forcing 2FA codes or passwords
- Check browser DevTools → are any secrets visible?

---

## 📚 Learn More

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [bcrypt Guide](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Fastify Security Tips](https://www.fastify.io/docs/latest/Guides/Security/)

---

✅ Security is part of what evaluators check. It shows you're a professional developer who respects privacy and safety.

> In short: **Security means protecting your users, your app, and your grade.**
