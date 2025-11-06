### API 
Summary
- Created `src/api/` and moved my existing frontend API helpers there.
- This is a mechanical separation (file moves + import path updates only.  No features added, no logic changed, no UI changes.).
- Sets up a small Fastify client layer for the frontend.

Why
- Central place for fetch/cookies/CORS, JSON parsing, and typed responses.
- Prepares the frontend for upcoming endpoints while I finish key backend routes.


Notes for frontend
- Components can import from `src/api/` (e.g., `api.auth.register(...)`) instead of using `fetch` directly.
- If you push HTML/Tailwind with element IDs, I will wire up the calls from this client layer—no need to worry about headers or cookies in the UI.

Next steps
- After (or in parallel with) finishing backend routes,  I will implement the Fastify client functions and DTO types here.
- Planned endpoints include: `/user/register`, `/auth/login`, `/users/:id`, etc.