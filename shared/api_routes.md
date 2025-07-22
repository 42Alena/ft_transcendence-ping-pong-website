# API Routes Overview

## Auth
- POST /api/register — Create account
- POST /api/login — Log in and receive JWT
- GET /api/me — Get user info (protected)

## Users
- GET /api/users/online — List of online users
- GET /api/users/:id — Get profile
- POST /api/users/:id/friends — Add friend

## Matches
- GET /api/matches/history — User's past matches
- POST /api/matches/result — Save match result

## Chat
- GET /api/messages/:userId — Chat history
- POST /api/messages/:userId — Send message
