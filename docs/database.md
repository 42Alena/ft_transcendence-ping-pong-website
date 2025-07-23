# 📚 ft_transcendence Database Schema (SQLite)

---

## 🧑 SECTION 1: USERS & AUTHENTICATION

### `users`
| Column        | Type     | Description                        |
|---------------|----------|------------------------------------|
| id            | INTEGER  | Primary key, auto-increment        |
| username      | TEXT     | Unique display name                |
| email         | TEXT     | Unique email, login credential     |
| password_hash | TEXT     | Hashed password                    |
| avatar_path   | TEXT     | Optional path to avatar            |
| twofa_secret  | TEXT     | 2FA shared secret (nullable)       |
| created_at    | DATETIME | Account creation timestamp         |
| last_login    | DATETIME | Last login timestamp               |

---

## 👥 SECTION 2: FRIEND SYSTEM

### `friends`
| Column     | Type    | Description                          |
|------------|---------|--------------------------------------|
| user_id    | INTEGER | FK to users.id (initiator)           |
| friend_id  | INTEGER | FK to users.id (target)              |
| status     | TEXT    | 'pending', 'accepted', or 'blocked'  |

---

## 💬 SECTION 3: LIVE CHAT

### `chat_messages`
| Column      | Type     | Description                |
|-------------|----------|----------------------------|
| id          | INTEGER  | Primary key                |
| sender_id   | INTEGER  | FK to users.id             |
| receiver_id | INTEGER  | FK to users.id             |
| message     | TEXT     | Message content            |
| timestamp   | DATETIME | Time of message            |
| is_read     | BOOLEAN  | True if read               |

---

## 🏓 SECTION 4: MATCH HISTORY

### `matches`
| Column      | Type     | Description                         |
|-------------|----------|-------------------------------------|
| id          | INTEGER  | Primary key                         |
| player1_id  | INTEGER  | FK to users.id or NULL for AI       |
| player2_id  | INTEGER  | FK to users.id or NULL for AI       |
| winner_id   | INTEGER  | FK to users.id                      |
| score1      | INTEGER  | Score of player 1                   |
| score2      | INTEGER  | Score of player 2                   |
| is_ai_game  | BOOLEAN  | True if played against AI           |
| created_at  | DATETIME | Timestamp of match                  |

---

## 🏆 SECTION 5: TOURNAMENTS

### `tournaments`
| Column     | Type     | Description                |
|------------|----------|----------------------------|
| id         | INTEGER  | Primary key                |
| name       | TEXT     | Tournament name            |
| created_at | DATETIME | When created               |
| finished   | BOOLEAN  | True if tournament is done |

### `tournament_participants`
| Column          | Type     | Description                      |
|-----------------|----------|----------------------------------|
| id              | INTEGER  | Primary key                      |
| tournament_id   | INTEGER  | FK to tournaments.id             |
| user_id         | INTEGER  | FK to users.id                   |
| alias           | TEXT     | Tournament alias (custom name)   |

---

## ⚙️ SECTION 6: GAME SETTINGS

### `game_settings`
| Column      | Type     | Description                       |
|-------------|----------|-----------------------------------|
| id          | INTEGER  | Primary key                       |
| user_id     | INTEGER  | FK to users.id                    |
| speed       | INTEGER  | Ball speed                        |
| powerups_on | BOOLEAN  | Whether power-ups are enabled     |
| mode        | TEXT     | Game mode (e.g., 'classic')       |

---

## 📊 SECTION 7: USER STATISTICS

### `stats`
| Column         | Type     | Description                |
|----------------|----------|----------------------------|
| user_id        | INTEGER  | FK to users.id             |
| matches_played | INTEGER  | Total matches played       |
| wins           | INTEGER  | Total wins                 |
| losses         | INTEGER  | Total losses               |
| last_updated   | DATETIME | Last update timestamp      |
