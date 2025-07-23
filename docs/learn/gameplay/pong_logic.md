# 🏓 Pong Logic – Beginner’s Guide (For All Ages)

## 🌐 What Is Pong Logic?

**Pong logic** is the core set of rules that control how the game works. It handles how the ball moves, how paddles react, how players score, and how the game resets.

In ft_transcendence, this logic is at the heart of our game engine.

👉 It controls everything that happens **inside the game loop**.

---

## 🧠 What the Pong Logic Must Handle

- 🎾 Ball movement and direction  
- 🧱 Wall collisions (top, bottom)  
- 🪞 Paddle collisions (left, right)  
- 🔁 Ball bounce angle and speed  
- 🏆 Score tracking  
- 🔄 Game reset after score or round end  

It also must support:
- ✅ Game customization (speed, paddle size, power-ups)  
- ✅ AI opponent (using logic, not real keys)  
- ✅ Multiplayer sync (over WebSocket)  

---

## 🧩 Where Pong Logic Runs

Pong logic is part of the **game engine**, which may be:
- In the frontend (browser) — for local or AI matches  
- In the backend (server) — if using server-side Pong  

The game loop updates at 60fps using `requestAnimationFrame()` or a timer.

---

## 🔄 What Happens Every Frame

1. Ball moves in its current direction  
2. Check if ball hits top/bottom wall → bounce  
3. Check if ball hits a paddle → bounce with angle  
4. Check if ball goes off screen → update score, reset  
5. Redraw everything (ball, paddles, score)  

This repeats ~60 times per second to create motion 🎞️

---

## ⚙️ Key Elements to Implement

### Ball:
- `x`, `y`, `dx`, `dy` → position and direction  
- `speed` → how fast the ball moves  

### Paddles:
- `x`, `y`, `height`, `width`  
- Move up/down based on player input or AI  

### Score:
- `leftPlayerScore`, `rightPlayerScore`  
- Update when ball goes out of bounds  

---

## 🧪 Tips for Clean Pong Logic

- Keep ball and paddle logic separate  
- Use bounding box collision detection  
- Reset ball to center after each point  
- Increase difficulty gradually (speed ramp-up)  
- Keep the loop efficient to avoid lag  

---

## 📚 Learn More

- [Build Pong from Scratch (FreeCodeCamp)](https://www.freecodecamp.org/news/how-to-build-pong-in-javascript/)  
- [MDN Game Loop Basics](https://developer.mozilla.org/en-US/docs/Games/Anatomy)  
- [Game Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)  

---

✅ In ft_transcendence, Pong logic keeps the game fair, fun, and smooth — for both AI and human players.

> In short: **Pong logic is the brain of our game – it moves the ball, tracks the score, and makes every bounce count.**
