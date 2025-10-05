# 📚 ft_transcendence Database Schema (SQLite)

---

## 🧑 TABLE: USERS

### `users`
| Column        | Type     | Description                        |
|---------------|----------|------------------------------------|
| id            | INTEGER  | Primary key, auto-increment        |
| username      | TEXT     | Unique display name                |
| email         | TEXT     | Unique email, login credential     |
| password_hash | TEXT     | Hashed password                    |
| is_anonymous  | BOOLEAN  | Default: false                     |
| anonymous_id  | TEXT     | anonymized for gdpr reasons        |
| created_at    | DATETIME | Account creation timestamp         |
| last_login    | DATETIME | Last login timestamp               |
| gdpr_consent  | BOOLEAN  | Default: false                     |
| data_ret_days | INTEGER  | Default: 730                       |
| delete_req    | BOOLEAN  | Default: false                     |
| delete_sched  | DATETIME | scheduled deletion date            |
---

## 👥 TABLE: FRIENDS

### `friends`
| Column     | Type    | Description                          |
|------------|---------|--------------------------------------|
| id         | INTEGER | PK                                   |
| user_id    | INTEGER | FK to users.id (initiator)           |
| friend_id  | INTEGER | FK to users.id (target)              |
| status     | TEXT    | 'pending', 'accepted', or 'blocked'  |
| created_at | DATETIME| current timestamp                    |

---

## 💬 TABLE: CHAT MESSAGES

### `chat_messages`
| Column      | Type     | Description                |
|-------------|----------|----------------------------|
| id          | INTEGER  | Primary key                |
| room_id     | VARCHAR  | FK to chat_rooms.id        |
| sender_id   | INTEGER  | FK to users.id             |
| receiver_id | INTEGER  | FK to users.id             |
| message_type| TEXT     | Message content            |
| content     | TEXT     | Content of the message     |
| is_encrypted| BOOLEAN  | True or false if encryptyed| 
| sent_at     | DATETIME | Time of message            |
| read_at     | DATETIME | Time of message read       |


### `chat_rooms`
| Column     | Type     | Description                |
|------------|----------|----------------------------|
| id         | VARCHAR  | Primary key                |
| name       | VARCHAR  | Chat room name             |
| created_by | INTEGER  | FK to users.id             |
| created_at | DATETIME | Date of creation of room   |


### `chat_room_participants`
| Column     | Type     | Description                |
|------------|----------|----------------------------|
| id         | INTEGER  | Primary key                |
| room_id    | VARCHAR  | FK to chat_rooms.id        |
| user_id    | INTEGER  | FK to users.id             |
| joined_at  | DATETIME | Date of user joined room   |
---

## 🏓 TABLE: MATCHES

### `matches`
| Column      | Type     | Description                         |
|-------------|----------|-------------------------------------|
| id          | INTEGER  | Primary key                         |
| player1_id  | INTEGER  | FK to users.id or NULL for AI       |
| player2_id  | INTEGER  | FK to users.id or NULL for AI       |
| winner_id   | INTEGER  | FK to users.id                      |
| score1      | INTEGER  | Score of player 1                   |
| score2      | INTEGER  | Score of player 2                   |
| match_durat | INTEGER  | Duration of the match               |
| game_mode   | VARCHAR  | Select type of game mode            |
| created_at  | DATETIME | Timestamp of match                  |

---

## 🏆 TABLE: TOURNAMENT

### `tournaments`
| Column     | Type     | Description                |
|------------|----------|----------------------------|
| id         | INTEGER  | Primary key                |
| name       | VARCHAR  | Tournament name            |
| description| TEXT     | Tournament description     |
| organizerid| INTEGER  | FK to users.id             |
| max_part   | INTEGER  | Number of max participants |
| current_par| INTEGER  | Number of current part     |
| start_date | DATETIME | Date of start of tournament|
| end_date   | DATETIME | Date of tournament ending  |
| created_at | DATETIME | Date of tournament creation|

### `tournament_participants`
| Column          | Type     | Description                      |
|-----------------|----------|----------------------------------|
| id              | INTEGER  | Primary key                      |
| tournament_id   | INTEGER  | FK to tournaments.id             |
| user_id         | INTEGER  | FK to users.id                   |
| position        | INTEGER  | Tournament position              |
| joined_at       | DATETIME | Date of player joined            |

---

### `tournament_matches`
| Column          | Type     | Description                      |
|-----------------|----------|----------------------------------|
| id              | INTEGER  | Primary key                      |
| tournament_id   | INTEGER  | FK to tournaments.id             |
| round_number    | INTEGER  | Round of tournament              |
| match_number    | INTEGER  | Match of tournament              |
| player1_id      | INTEGER  | FK to users.id                   |
| player2_id      | INTEGER  | FK to users.id                   |
| winner_id       | INTEGER  | FK to users.id                   |
| player1_score   | INTEGER  | Score of player1                 |
| player2_score   | INTEGER  | Score of player2                 |
| scheduled_time  | DATETIME | Schedule start of match          |
| started_at      | DATETIME | Date of started match            |
| completed_at    | DATETIME | Date of completion of match      |

---

## 📊 TABLE: USER STATISTICS

### `stats`
| Column         | Type     | Description                |
|----------------|----------|----------------------------|
| user_id        | INTEGER  | PK + FK to users.id             |
| total_matches  | INTEGER  | Total matches played       |
| wins           | INTEGER  | Total wins                 |
| losses         | INTEGER  | Total losses               |
| win_streak     | INTEGER  | Wins streak of player      |
| max_win_streak | INTEGER  | Max win streak             |
| total_goals_sc | INTEGER  | Total goals scored         |
| total_goals_re | INTEGER  | Total goal received        |
| avg_match_dur  | INTEGER  | Avg duration of match      |
| rating         | INTEGER  | Rating of the player       |
| rank           | INTEGER  | Rank of the player         |
| last_updated   | DATETIME | Last update timestamp      |


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


### Database creation
In order to create the database we created a sql script 'create_schema.sql' that will create the tables and name the primary and foreign keys to stablish the relationship between tables. We also set indexes in order to improve the database performance and created a default admin user at initialization.
It will be created inside a docker image (SQLite) and make it persistent so the changes made are saved after shuting down the docker container. 

## The ERD diagram 
The ERD diagram of the tables it's presented below: 

![alt text](<ERD Diagram Pong.png>)

