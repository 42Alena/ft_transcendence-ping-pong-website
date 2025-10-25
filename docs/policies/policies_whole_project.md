
# Input & Validation Policies — ft_transcendence

Defines backend validation for all user input in registration, login, and profile update.  
All checks are enforced **server-side**, as required by the subject.

---

## 1️⃣ Username & Display Name

### Shared Rules (apply to both)
- **Required**
- **Length:** 3–10 characters  
- **Allowed:** letters, digits, underscore (`_`)
- **Must start with a letter**
- **No spaces or symbols inside** (spaces before/after are trimmed)
- **Reserved words:** `admin`, `root`, `null`, `system`, `api`, `me`
- **Case-insensitive** checks → compare using lowercase
- **Regex:** `^[A-Za-z][A-Za-z0-9_]{2,9}$`  → total length **3–10**

### Username
- **Uniqueness:** not required  
- Store both:
  - **Original** (as entered)
  - **Canonical** (lowercased) for comparison

### Display Name
- **Uniqueness:** required (case-insensitive)  
- Same format rules as username

---

## 2️⃣ Password
- **Minimum length:** 8 characters  
- Must include **letters** and **numbers**  
- Recommended: add **one uppercase** or **special** character  
- Must **not contain** username or display name (case-insensitive)
- **Hash before storing** (bcrypt or argon2)
- **Never** log or send plaintext passwords

---

## 3️⃣ Avatar
- Optional; if none → use **default avatar**
- If uploaded:
  - **Types:** `jpg`, `png`, `webp`
  - **Max size:** 2 MB  
  - **Max dimensions:** 512×512 px  
  - Store with **random filename** (no user path)
  - **Reject** unsupported formats (`gif`, `svg`, etc.)

---

## 4️⃣ Backend Validation Order
1. Trim + normalize (Unicode NFC)  
2. Regex format check  
3. Reserved-name check (lowercase)  
4. **If displayName:** DB uniqueness check  
5. Password check → hash  
6. Avatar check → store or default

---

## 5️⃣ Error Contract (JSON)
Use **HTTP 400 Bad Request** for invalid input.

Example:
```json
{ "error": "InvalidField", "field": "displayName", "message": "Display name is taken" }
````

Other messages:

* `"Required"`
* `"Use 3–10 letters/digits/underscore, start with a letter"`
* `"This name is reserved"`
* `"Password too weak"`
* `"Unsupported avatar format"`
* `"Avatar too large"`

---

## 6️⃣ Security Notes

* Sanitize inputs and escape outputs (avoid XSS)
* Use **HTTPS / WSS** for all communication
* Keep secrets (JWT keys, salts, DB path) in **.env**
* Use proper HTTP methods (`POST`, `PUT`, `DELETE`) for state changes


