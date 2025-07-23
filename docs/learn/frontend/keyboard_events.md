# ⌨️ Keyboard Events – Beginner’s Guide (For All Ages)

## 🌐 What Are Keyboard Events?

**Keyboard events** are how the browser knows when you press or release a key. We use them to **control the Pong paddle**, move through menus, or simulate keys for AI.

👉 Docs: [https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

They help us capture user actions in real time — like pressing "W" to go up or "S" to go down.

---

## 🎮 Why We Use Keyboard Events in ft_transcendence

- ✅ Used for paddle movement in 1v1 and AI matches  
- ✅ Enables real-time control in the browser  
- ✅ Required for local multiplayer mode  
- ✅ Helps simulate movement in AI (fake key presses)  

Every player action starts with a key press.

---

## 🧠 Key Events to Know

There are three main types:

- `keydown` – when a key is pressed down  
- `keyup` – when a key is released  
- `keypress` – older event (usually avoided)  

We listen for `keydown` and `keyup` to update paddle movement state.

---

## 🧩 How It Works in Our Project

1. User presses a key → event is triggered  
2. Game captures which key it was (`event.key`)  
3. Paddle starts moving (e.g. up or down)  
4. On `keyup`, paddle stops moving  

In multiplayer: these key actions are sent over WebSocket to sync.  
In AI mode: AI logic "pretends" to press keys at regular intervals.

---

## 🔢 Common Keys for Our Game

- `w` → Player 1 up  
- `s` → Player 1 down  
- `ArrowUp` → Player 2 up  
- `ArrowDown` → Player 2 down  
- `Enter` → Start game / accept match  
- `Escape` → Leave / cancel  

Make sure to use `event.key.toLowerCase()` for consistency.

---

## ⚙️ Example Flow in Code

```js
window.addEventListener('keydown', (e) => {
  if (e.key === 'w') movePaddleUp();
  if (e.key === 's') movePaddleDown();
});

window.addEventListener('keyup', (e) => {
  stopPaddle();
});
