# Shared Folder Overview

This folder contains all common types, constants, and event names used across frontend, backend, and game logic.

## Structure

- `constants.ts` – global game settings (tick rate, ball speed, canvas size)
- `events.ts` – WebSocket event names (sync, chat, invites)
- `types.ts` – TypeScript interfaces for User, Match, etc.
- `api_routes.md` – planned API contract
- `assets/` – shared static resources (avatars, fonts, sounds)

All imports must reference this folder to prevent desync or duplication.

## Usage

```ts
import { EVENTS } from '@/shared/events';
import { PADDLE_SPEED } from '@/shared/constants';
import type { Match } from '@/shared/types';
