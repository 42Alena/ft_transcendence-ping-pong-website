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