
---

#   Current Database (Active Schema)

> Source: `create_schema.sql` (active)
> Notes: `PRAGMA foreign_keys = ON`, `PRAGMA journal_mode = WAL`

---

## 👤 Table: `users`

| Column         | Type    | Used by / Purpose                                        |
| -------------- | ------- | -------------------------------------------------------- |
| `id`           | TEXT    | `User.id` (string) generated in code; primary identifier |
| `username`     | TEXT    | Unique display name; registration/login & profile        |
| `passwordHash` | TEXT    | Hashed password stored by backend                        |
| `avatarUrl`    | TEXT    | Optional avatar shown in profile/chat                    |
| `userStatus`   | TEXT    | `'online' \| 'offline'`; presence in UI                  |
| `isDeleted`    | INTEGER | GDPR flag (`0` active / `1` deleted)                     |

---

## 🤝 Table: `relations` (friends + blocks)

| Column     | Type | Used by / Purpose                        |
| ---------- | ---- | ---------------------------------------- |
| `userId`   | TEXT | Owner of the relation (FK → `users.id`)  |
| `otherId`  | TEXT | Friend or blocked user (FK → `users.id`) |
| `relation` | TEXT | `'friend'` or `'block'` (unified model)  |

**Primary key:** (`userId`, `otherId`, `relation`) — prevents duplicates.
**Behavior:** `ON DELETE CASCADE` cleans relations on user deletion.

---

## 💬 Table: `messages`

| Column       | Type    | Used by / Purpose                                                          |
| ------------ | ------- | -------------------------------------------------------------------------- |
| `id`         | INTEGER | Auto-increment message id                                                  |
| `type`       | TEXT    | `'PublicMsg' \| 'PrivateMsg' \| 'PrivateGameInviteMsg' \| 'TournamentMsg'` |
| `senderId`   | TEXT    | Sender user id (or SystemId for tournament notices)                        |
| `receiverId` | TEXT    | Target user id or `'all'` for public chat                                  |
| `content`    | TEXT    | Message body                                                               |

---

## 🏆 Table: `tournaments`

| Column      | Type    | Used by / Purpose                   |
| ----------- | ------- | ----------------------------------- |
| `id`        | INTEGER | Tournament id                       |
| `name`      | TEXT    | Tournament name (UI)                |
| `createdAt` | INTEGER | UNIX timestamp for creation/history |

---

## 🧑‍🤝‍🧑 Table: `tournamentPlayers`

| Column         | Type    | Used by / Purpose                                  |
| -------------- | ------- | -------------------------------------------------- |
| `id`           | INTEGER | Row id for participant                             |
| `tournamentId` | INTEGER | FK → `tournaments.id`                              |
| `userId`       | TEXT    | FK → `users.id` (nullable for alias-only entrants) |
| `alias`        | TEXT    | Display alias (for alias-only tournaments)         |
| `isWinner`     | INTEGER | `1` if tournament winner                           |

**Behavior:** `ON DELETE CASCADE` on `tournamentId`; `userId` uses `SET NULL` to keep alias rows if user removed.

---

## 🧾 Table: `gdprRequests`

| Column        | Type    | Used by / Purpose               |
| ------------- | ------- | ------------------------------- |
| `id`          | INTEGER | Request id                      |
| `userId`      | TEXT    | FK → `users.id` (affected user) |
| `action`      | TEXT    | `'anonymize'` or `'delete'`     |
| `requestedAt` | INTEGER | UNIX timestamp of request       |

---
