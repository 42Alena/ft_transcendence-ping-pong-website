Hello Sveva! 👋 from Alena

I’ve set everything up so you can work independently while I’m away. Here’s everything you need:

✅ Where to Find Your Tasks

    Your detailed plan:
    tasks/sveva/todo/PLAN_sveva.md

    Your todo checklist:
    tasks/sveva/todo/TODO_sveva.md

    Daily log file:
    tasks/sveva/done/DONE_<date>.md

    Full team plan + timeline:
    tasks/README.md

📁 Where to Work (Your Code Folders)

    Sveva:
    game/sveva_ai/, game/sveva_tournament/, frontend/sveva_game_canvas/

    Everyone shares:
    shared/ → event names, constants, assets

📘 Documentation

    Project structure, folder map, and system flow diagram:
    docs/architecture.md

    Feature-specific docs:
    docs/sockets.md, docs/chat.md, docs/ai.md, docs/auth.md


#### ✅ STARTUP TODO

- [ ] **Check `/shared/` before starting**
  - Use `constants.ts` for paddle speed, tick rate, canvas size
  - Use `events.ts` for all socket event names
  - Use `types.ts` for User, Match, ChatMessage structures
  - Use `api_routes.md` for any backend/REST API interactions