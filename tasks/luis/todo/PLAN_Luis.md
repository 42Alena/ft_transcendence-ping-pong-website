### 👤 Luis – Backend & Auth Lead

Modules:

* Fastify Backend (Major)
* 2FA + JWT (Major)

---

#### ⚙️ Fastify Backend

**Goal:** Handle all data logic and user authentication
**Eval Required:** Must have routes for auth, stats, friends, match history

##### 📦 Project Init

1. `npm install fastify dotenv better-sqlite3 fastify-cors`
2. Create folder layout:

   * `/routes` – all route handlers
   * `/db` – DB file and query helpers
   * `/services` – logic functions

##### 🧱 SQLite Schema

3. Tables:

   * users: id, email, password\_hash, avatar
   * matches: id, player1, player2, result, date, settings
   * friends: user\_id, friend\_id
   * messages: sender\_id, receiver\_id, text
   * blocked: blocker\_id, blocked\_id

##### 🔑 User Routes

4. `/register` – hash password, save user
5. `/login` – verify password, return JWT
6. `/me` – protected by token, return user info

##### 📈 Match + Stats

7. `/match/start`, `/match/end`, `/match/history/:userId`
8. `/stats/:userId` – return win/loss, history

##### 👥 Friends

9. `/friends/add`, `/remove`, `/list`

---

#### 🔐 2FA + JWT

**Goal:** Secure login system and session flow
**Eval Required:** Login must support 2FA + JWT token

##### 🔑 JWT Login

1. After successful login, generate:

   ```js
   jwt.sign({ userId }, SECRET, { expiresIn: '1h' })
   ```
2. Send to frontend
3. Frontend stores in `localStorage`
4. For protected routes: check token in headers

##### 🔒 Add 2FA

5. Use `otplib` to generate 2FA token or send email code
6. Save `2fa_secret` in DB
7. On login:

   * Ask for code
   * Validate using `otplib.authenticator.check(code, secret)`
8. Only issue JWT after 2FA success

##### 🔗 WebSocket Auth

9. Client sends token with socket connection
10. Server verifies and attaches user info to socket

---
## 🗃 Database Schema Overview

| Table | Column | Type | Description |
|-------|--------|------|-------------|
| `users` | `id` | `INTEGER` | Primary key, auto-increment |
| `users` | `username` | `TEXT` | Unique display name |
| `users` | `email` | `TEXT` | Unique email for login |
| `users` | `password_hash` | `TEXT` | Hashed password |
| `users` | `avatar_path` | `TEXT` | Optional avatar URL or path |
| `users` | `twofa_secret` | `TEXT` | TOTP shared secret for 2FA |
| `users` | `created_at` | `DATETIME` | Account creation timestamp |
| `users` | `last_login` | `DATETIME` | Last login timestamp |
| `friends` | `user_id` | `INTEGER` | FK → users.id (initiator) |
| `friends` | `friend_id` | `INTEGER` | FK → users.id (target) |
| `friends` | `status` | `TEXT` | 'pending', 'accepted', or 'blocked' |
| `chat_messages` | `id` | `INTEGER` | Primary key |
| `chat_messages` | `sender_id` | `INTEGER` | FK → users.id |
| `chat_messages` | `receiver_id` | `INTEGER` | FK → users.id |
| `chat_messages` | `message` | `TEXT` | Message content |
| `chat_messages` | `timestamp` | `DATETIME` | Time message was sent |
| `chat_messages` | `is_read` | `BOOLEAN` | True if message was read |
| `matches` | `id` | `INTEGER` | Primary key |
| `matches` | `player1_id` | `INTEGER` | FK → users.id or NULL for AI |
| `matches` | `player2_id` | `INTEGER` | FK → users.id or NULL for AI |
| `matches` | `winner_id` | `INTEGER` | FK → users.id (nullable) |
| `matches` | `score1` | `INTEGER` | Score of player 1 |
| `matches` | `score2` | `INTEGER` | Score of player 2 |
| `matches` | `is_ai_game` | `BOOLEAN` | True if played against AI |
| `matches` | `created_at` | `DATETIME` | When match was played |
| `tournaments` | `id` | `INTEGER` | Primary key |
| `tournaments` | `name` | `TEXT` | Name of the tournament |
| `tournaments` | `created_at` | `DATETIME` | Creation timestamp |
| `tournaments` | `finished` | `BOOLEAN` | True if completed |
| `tournament_participants` | `id` | `INTEGER` | Primary key |
| `tournament_participants` | `tournament_id` | `INTEGER` | FK → tournaments.id |
| `tournament_participants` | `user_id` | `INTEGER` | FK → users.id |
| `tournament_participants` | `alias` | `TEXT` | Alias during this tournament |
| `game_settings` | `id` | `INTEGER` | Primary key |
| `game_settings` | `user_id` | `INTEGER` | FK → users.id |
| `game_settings` | `speed` | `INTEGER` | Game speed setting |
| `game_settings` | `powerups_on` | `BOOLEAN` | Whether powerups are enabled |
| `game_settings` | `mode` | `TEXT` | Game mode (e.g., 'classic') |
| `stats` | `user_id` | `INTEGER` | FK → users.id |
| `stats` | `matches_played` | `INTEGER` | Total matches played |
| `stats` | `wins` | `INTEGER` | Total wins |
| `stats` | `losses` | `INTEGER` | Total losses |
| `stats` | `last_updated` | `DATETIME` | Last update timestamp |

