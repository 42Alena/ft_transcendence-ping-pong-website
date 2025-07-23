# 🔐 bcrypt – Beginner’s Guide (For All Ages)

## 🌐 What is bcrypt?

**bcrypt** is a special tool that helps us **hide and protect passwords**.

When someone creates an account, we don’t want to save their password as-is (like `dragon123`). Instead, we use bcrypt to **turn it into a scrambled, unreadable version** that only bcrypt can verify — but never reverse.

👉 Official site: [https://github.com/kelektiv/node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)

Think of it like a secret-code machine. Once you put in the password, it returns a code. You can’t turn the code back into the original password — but you can ask: “Does this input match the code?”

---

## 🛡️ Why We Use bcrypt in ft_transcendence

In our project, we want players to:
- Create secure accounts  
- Know their passwords are safe  
- Be protected even if our database is leaked  

bcrypt helps us:
- ✅ Follow the subject rule: "All passwords must be hashed"  
- ✅ Protect users from attacks  
- ✅ Build a modern login system  

---

## 🧩 How It Fits Into Our Architecture

- User types a password → Fastify backend receives it  
- bcrypt hashes it → saves the hash into SQLite  
- On login, bcrypt compares the password with the stored hash  

It works like a digital lock 🔐

We never store the real password — only a scrambled version.

---

## 🔢 How bcrypt Hashing Works (Simple Idea)

1. You give bcrypt the password (e.g. `hello123`)  
2. bcrypt adds **salt** (random extra data)  
3. It mixes it all together into a hash (e.g. `$2b$10$asd.....`)  
4. This hash is stored in the database  

When someone logs in:
- We take what they typed  
- Hash it the same way  
- Compare it to the stored hash  

If they match → login success!

---

## ⚙️ bcrypt Configuration

You can adjust the **cost factor** (how hard it scrambles):
- `10` = standard and fast  
- `12+` = stronger, but slower  

We use 10 or 12 for balance between security and speed.

---

## 🧪 Tips and Good Habits

- Always hash before saving passwords  
- Never store raw passwords in your DB  
- Use `bcrypt.compare()` to check at login  
- Add 2FA for even more security  
- Don’t log or print password inputs in production  

---

## 📚 Learn More

- [bcrypt.js GitHub](https://github.com/kelektiv/node.bcrypt.js)  
- [OWASP Password Storage Guide](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)  
- [bcrypt explained simply](https://auth0.com/blog/hashing-passwords-one-way-road-to-security/)  

---

✅ With bcrypt, our ft_transcendence project ensures that even if someone breaks into our database, they’ll only see scrambled nonsense — and users stay safe.

> In short: **bcrypt is our password bodyguard — it protects every user from being hacked by turning secrets into unbreakable codes.**
