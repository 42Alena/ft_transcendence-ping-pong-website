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