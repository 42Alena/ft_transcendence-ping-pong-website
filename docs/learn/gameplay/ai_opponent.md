# 🤖 AI Opponent – Beginner’s Guide (For All Ages)

## 🌐 What Is an AI Opponent?

An **AI Opponent** is a computer-controlled player. It tries to behave like a human — it sees what’s happening in the game and reacts like a real player.

In our Pong game, the AI is the paddle on one side of the screen, playing against the human. It must move, defend, and try to win — just like a real person would.

👾 We don’t use any fancy machine learning — just logic, math, and smart prediction!

---

## 🎯 Goal of the AI Opponent Module

In ft_transcendence, we chose the AI Opponent module because:
- ✅ It’s a Major Module
- ✅ It’s fun and makes the game playable solo
- ✅ It teaches logic and smart coding
- ✅ It is officially allowed and described in the subject

Your AI must:
- Simulate key presses (like real players)
- Only refresh the screen **once per second** (this is important!)
- Make decisions and predictions using game logic
- Work with any game customization (speed, power-ups, etc.)
- Sometimes **win**, not just lose!

---

## 🧠 How the AI Thinks

To keep it simple, we can break AI into small steps:

1. **Look at the ball position** (but only once per second!)  
2. **Predict where it’s going** using the direction and speed  
3. **Move the paddle** to match that position  
4. Simulate key presses: 'up', 'down', or 'none'  

It’s like playing with a blindfold and peeking once every second 👁️

---

## 🧩 How It Fits Into Our Architecture

- The AI is part of the **game loop logic**  
- It acts like a player object, but has no keyboard  
- It follows the same game rules (same paddle speed, same power-up effects)  
- It’s activated when the user chooses “Play vs AI”  
- It must work with real-time multiplayer code, but without WebSockets  

---

## 🕹️ AI Challenges

Some things can be tricky:
- 🐢 Moving too slowly = missing the ball  
- 🚀 Overreacting = unstable gameplay  
- 🔮 Predicting wrong = bad defense  
- 🎲 Making it feel "too perfect" is boring — add some randomness!

Good AI is **challenging but beatable** — like playing with a smart friend.

---

## ⚙️ Game Mechanics to Use

- Ball direction and speed  
- Paddle height and speed  
- Wall positions  
- Score state (optional logic)

You can also:
- Delay reaction time randomly (e.g. 0.2–0.4 sec)  
- Make it move toward a slightly off-target point  

---

## 📦 Where the Code Belongs

AI logic can live inside:
- `game/ai.ts` or `game/ai.js`  
- Called by the main game loop, not by player input  
- Simulates keypresses that get passed to the same game engine used by humans  

---

## 🧪 Tips and Good Practices

- Keep AI paddle speed equal to human paddle  
- Never cheat — follow the same game rules  
- Use one-second update intervals with `setInterval()` or game ticks  
- Make AI feel human: not too fast, not too slow  
- Test against yourself!  

---

## 📚 Learn More

- [Simple Pong AI](https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-ai-for-pong--cms-34061)  
- [Game Loop Basics](https://developer.mozilla.org/en-US/docs/Games/Anatomy)  
- [AI Movement Patterns (basic)](https://www.red3d.com/cwr/steer/)  

---

✅ In our ft_transcendence project, the AI Opponent makes the game playable even without another person — and makes the experience feel smart and dynamic.

> In short: **Our AI Opponent is the invisible player who learns and plays using logic, prediction, and fairness — all within our Pong universe.**
