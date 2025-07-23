# 📘 TypeScript – Beginner’s Guide (For All Ages)

## 🌐 What Is TypeScript?

**TypeScript** is a programming language that builds on JavaScript by adding **types**. That means it helps you catch mistakes before you even run your code.

It’s like JavaScript with safety gear! 🦺

👉 Official site: [https://www.typescriptlang.org](https://www.typescriptlang.org)

---

## 💡 Why We Use TypeScript in ft_transcendence

- ✅ Type safety = fewer bugs during development  
- ✅ Works great with React and Vite  
- ✅ Helps document your code (you know what type everything is)  
- ✅ Required by our chosen setup (React + Tailwind + Vite use it)  

TypeScript helps teams understand the code better, and avoid small mistakes that cause big problems.

---

## 🧠 Basic TypeScript Concepts

### 1. Types for Variables

```ts
let name: string = "Player";
let score: number = 100;
let isReady: boolean = true;


### 2. Function Parameters and Return Types

```ts
function addScore(a: number, b: number): number {
  return a + b;
}


### 3. Interfaces (like blueprints for objects)

interface Player {
  id: number;
  username: string;
  isOnline: boolean;
}

### 4. Optional and Default Values

function greet(name: string = "guest") {
  console.log("Hello " + name);
}

## ⚙️ Where We Use TypeScript in Our Project

    Frontend UI components (React + .tsx)

    Chat logic (event types)

    Game state and props

    Socket event payloads

    Data models (User, Match, etc.)

## 🧪 Tips for TypeScript Success

    Always define types/interfaces for complex objects

    Use any only as a last resort

    Let the IDE help — it can auto-suggest correct types

    If something breaks, check type mismatch first

    Use tsconfig.json to control strictness

## 📚 Learn More

- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [TS for JS Devs](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [React + TS Guide](https://react-typescript-cheatsheet.netlify.app/)

## ✅ TypeScript helps us build safer, smarter code for ft_transcendence. It’s like a grammar checker for JavaScript that works in real time.

    In short: TypeScript is JavaScript with superpowers — it helps you avoid bugs and write clean code.