# 🖼️ Canvas API – Beginner’s Guide (For All Ages)

## 🌐 What is the Canvas API?

The **Canvas API** is a tool built into web browsers that lets us draw shapes, animations, and games directly on a webpage — like a digital whiteboard 🎨.

In ft_transcendence, we use the Canvas API to **draw the Pong game**: paddles, ball, background, score, and effects.

👉 Docs: [https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 🎮 Why Use Canvas for Our Pong Game?

- ✅ Fast and smooth performance for 2D games  
- ✅ Works in all modern browsers  
- ✅ You can draw, animate, and update the screen at 60fps  
- ✅ It gives full control over how things look  
- ✅ It fits perfectly with real-time multiplayer and AI  

Canvas helps us build the **visual part** of the game, frame by frame.

---

## 🧠 Key Concepts

- **Canvas Element**: The HTML `<canvas>` is where everything is drawn  
- **2D Context**: The code uses a special mode: `canvas.getContext('2d')`  
- **Game Loop**: The screen updates every frame (usually 60 times per second)  
- **Clear and Redraw**: Each frame erases and redraws all game objects  

---

## 🧱 What We Draw in ft_transcendence

- 🟫 Player paddles (left & right)  
- ⚪ The ball  
- 🧮 The score  
- 🔲 Borders or power-ups (if enabled)  
- 🟦 Background and effects  

Everything is drawn using simple shapes: rectangles, circles, text.

---

## ⚙️ How It Fits In Our Codebase

- The `<canvas>` element lives inside a React/TypeScript component  
- The main game loop uses `requestAnimationFrame()`  
- Paddle/ball positions are updated from socket/game state  
- Canvas redraws everything from current state every frame  

Canvas is the final step: it turns math and logic into actual visuals 👁️

---

## 🧪 Tips for Good Canvas Usage

- Always call `clearRect()` before redrawing each frame  
- Keep your draw functions modular: `drawBall()`, `drawPaddle()`  
- Use `requestAnimationFrame()` for smooth motion  
- Match the canvas size to the game resolution  
- Keep state and rendering separate (logic in JS, visuals in canvas)  

---

## 📚 Learn More

- [Canvas API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)  
- [2D Drawing Guide](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)  
- [Intro to Canvas (freecodecamp)](https://www.freecodecamp.org/news/how-to-use-the-html5-canvas/)  

---

✅ In ft_transcendence, Canvas lets us draw and animate the game exactly how we want — in real time, for every player.

> In short: **Canvas is our game screen — it turns numbers and code into movement, action, and fun.**
