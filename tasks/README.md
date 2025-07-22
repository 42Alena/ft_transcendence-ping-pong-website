# 📋 ft_transcendence – Team Plan (3 Members)

## 🧑‍🤝‍🧑 Team Members & Roles

| Name   | Role                  | Responsibilities |
|--------|-----------------------|------------------|
| Alena  | Real-Time Systems Lead | Sockets, Chat, Game Customization |
| Luis   | Backend & Auth Lead   | Fastify API, SQLite DB, JWT, 2FA |
| Sveva  | Game Logic & AI Lead  | Canvas game, AI, Tournament |

---

## 📦 Modules Selected (7 Majors Total)

| Type         | Module                      | Owner  | Notes |
|--------------|-----------------------------|--------|-------|
| Major        | Remote Players              | Alena  | Multiplayer WebSockets |
| Major        | Live Chat                   | Alena  | DM, block, invites |
| Minor + Minor| Game Customization + Tailwind | Alena  | Game mode, power-ups |
| Major        | Fastify Backend             | Luis   | Full API server |
| Major        | 2FA + JWT Auth              | Luis   | Login security |
| Major        | AI Opponent                 | Sveva  | No A*, refresh = 1s |
| Major        | Standard User Management    | Sveva  | Profiles, avatars, stats |

---

## ⏳ Project Timeline – 2 Phases

### 🐢 Month 1: Planning & Setup (Slow)

| Week | Focus                          | Goal |
|------|--------------------------------|------|
| Week 1 | Project structure & roles     | Finalize folder layout, Git rules, task folders, shared constants |
| Week 2 | Learn tools & write docs      | Fastify, socket.io, Tailwind, SQLite — everyone writes their plan/docs |
| Week 3 | Minimal backend/frontend test | Luis: basic Fastify server; Alena: test socket ping/chat; Sveva: canvas |
| Week 4 | Team sync                     | Push basic working parts to main, test socket+API + prepare for real work |

---

### 🚀 Month 2: Build & Polish (Intensive)

| Week | Focus                            | Goal |
|------|----------------------------------|------|
| Week 5 | Core features                   | Luis: JWT/2FA; Alena: chat system; Sveva: ball/paddle/score logic |
| Week 6 | Multiplayer + AI + Game UI     | Socket-based play; AI opponent movement; customization menus |
| Week 7 | Tournament + profile system     | Sveva: matchmaking; Luis: user stats + friend list |
| Week 8 | Integration + Docker + Testing | SPA navigation; game logic sync; Docker containers; final cleanup |


---

## 📝 Notes
- All teammates work in separate folders
- Only `main` is protected — all features in branches
- Socket events, types, and assets are shared under `shared/`
_____________________________________________________________________________________________________________________________

## ft\_transcendence – Team Execution Plan (Beginner-Friendly, Technical To-Do with Explanations)

> 💡 **Terms you will see often:**
>
> * **Socket.IO** = a library that lets browsers and servers talk in real-time (like a phone call instead of sending a letter)
> * **JWT** = JSON Web Token, used to securely identify who is logged in
> * **API** = Set of URLs that frontend calls to send or get data from backend
> * **Middleware** = A function that checks/modifies a request before it continues
> * **CORS** = A browser rule that controls what external URLs your code can talk to
___________________________________________________________________________________________________________________
### 👤 Alena – Real-Time Systems Lead

Modules:

* Remote Players (Major)
* Live Chat (Major)
* Tailwind + Game Customization (2 Minors = Major)

---

#### 🎮 Remote Players (real-time multiplayer)

**Goal:** Let players play Pong together on different computers
**Eval Required:** Must work smoothly over the internet with reconnect logic

##### 🛠 Setup

1. `npm install socket.io` on backend
2. In Fastify, create the Socket.IO server:

   ```js
   import { Server } from 'socket.io'
   const io = new Server(httpServer, { cors: { origin: '*' } });
   ```
3. Start listening to connections:

   ```js
   io.on('connection', socket => {
     console.log('A user connected:', socket.id);
   });
   ```

##### 🔄 Match Session

4. When players join game, extract match ID:

   ```js
   socket.join(matchId); // puts both players in same room
   ```
5. Save sockets in a dictionary:

   ```js
   const players = {}; players[socket.id] = matchId;
   ```

##### 🏓 Sync Paddle + Ball

6. When player moves paddle, emit from client:

   ```js
   socket.emit('paddleMove', { y: 300 });
   ```
7. Server receives it and sends to other:

   ```js
   socket.to(matchId).emit('opponentPaddle', { y });
   ```
8. Ball logic can stay client or be moved to server (your choice)
9. Broadcast ball position/score regularly (e.g., every frame or second)

##### 🔁 Reconnect & Error Handling

10. On disconnect:

* Save last game state
* Inform opponent: `socket.to(room).emit('opponent_left')`

11. On reconnect:

* Frontend reconnects using saved match ID
* Server resends state (paddles, ball, score)

12. Wrap all emits in try/catch to avoid crashes

---

#### 💬 Live Chat (with DMs, invites, blocking)

**Goal:** Allow players to chat, invite to game, block others
**Eval Required:** Must support real-time DMs, invite, profile link, block

##### 🧱 Interface

1. Create a sidebar or floating panel
2. Add text input and send button
3. Show messages in scrollable div with timestamp

##### 🔌 Messaging Logic

4. When user types:

   ```js
   socket.emit('chatMessage', { toUserId, text });
   ```
5. Server receives → checks blocklist → sends to recipient
6. Receiver client displays it in message area

##### 🚫 Blocking System

7. Add "Block" button in profile or chat
8. Backend: add blocked table `blocked(userId, blockedId)`
9. Before sending: check if recipient blocked sender

##### 🎮 Game Invites

10. Invite button → `socket.emit('inviteToGame', userId)`
11. Recipient sees popup (accept/reject)
12. On accept → both users join game room `/match/:id`

##### 📇 Profile Linking

13. Make usernames clickable
14. Navigate to `/profile/:userId` using Vue Router or similar
15. Fetch and display profile info from backend

---

#### 🎨 Tailwind + Game Customization (CSS + Options)

**Goal:** Style all pages with Tailwind and allow game settings
**Eval Required:** Game has UI for options like speed, power-ups, etc.

##### 🎨 Tailwind Setup

1. `npm install -D tailwindcss postcss autoprefixer`
2. `npx tailwindcss init`
3. Add to CSS file:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Use classes like `text-center`, `bg-gray-800`, `rounded-lg`

##### 🧩 Apply Styles

5. Login page = center form, buttons with hover
6. Game page = paddles, score, UI buttons
7. Chat panel = bubbles, scroll, color badges

##### ⚙️ Custom Settings Panel

8. In pre-match screen, show:

   * Game speed: dropdown (slow, normal, fast)
   * Power-ups: toggle on/off
   * Paddle size: slider (small to large)
9. Store in local state or DB
10. Send to other player via socket
11. Server saves with match info

##### 🔁 Use Settings in Game

12. Game engine reads these values on start
13. AI must use these settings too
14. Apply logic (e.g., if speed=fast, reduce frame delay)

---
____________________________________________________________________________________________________________________
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
__________________________________________________________________________________________________________
### 👤 Sveva – Game Logic & AI Lead

Modules:

* AI Opponent (Major)
* Standard User Management (Major)

---

#### 🧠 AI Opponent

**Goal:** Let player play vs a computer opponent
**Eval Required:** AI must play reasonably well and follow settings

##### 🕹 Game Engine

1. Build canvas game: draw ball, paddles
2. Ball physics: bouncing, direction, collisions
3. Score logic: if ball passes paddle, add point

##### 🤖 AI Controller

4. Every 1 second:

   * Read ball position and speed
   * Predict where it will reach AI paddle
   * Move paddle toward that Y position

5. Simulate key events

   * AI sends same event: `socket.emit('paddleMove', { y })`

6. Add randomness:

   * Delay response by 100-500ms
   * Occasionally miss on purpose

##### 🛠 Read Match Settings

7. Use game speed, paddle size from match setup
8. If power-ups enabled → AI can trigger them

##### 🚨 Backup Logic

9. If a player disconnects → AI can step in and play

---

#### 👤 Standard User Management

**Goal:** Register users, manage profiles and friends
**Eval Required:** Users can login, view profile, see match history

##### 👤 Auth Pages

1. Create login and signup forms
2. Send credentials to backend
3. Store JWT token on login

##### 📇 Profile View

4. Fetch `/me` and show avatar, stats
5. Upload avatar or choose default
6. Display win/loss stats and total matches

##### 👥 Friends

7. Add/remove friend buttons
8. Show status: online = green dot
9. Show list in sidebar with profile links

##### 📜 Match History

10. Fetch match data from API
11. Show opponent, result, score, date
12. Mark if game was vs AI or real player

---

### ✅ Final Evaluation Requirements

* ✅ Game works locally on same keyboard
* ✅ Matchmaking + tournament setup exists
* ✅ Remote multiplayer sync works (WebSockets)
* ✅ UI is SPA (no reloads, supports back/forward browser buttons)
* ✅ Passwords hashed, HTTPS enabled
* ✅ 2FA and JWT security used
* ✅ .env for secrets, no tokens in git
* ✅ All routes + chat/game/AI work live

---

### 🔁 Team Dependencies

* Alena needs Luis for: socket token, match info
* Sveva needs Alena's customization values for AI
* Luis needs to finish DB + APIs first to unblock others


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
