-- ============================================================
--  Final working schema aligned with TypeScript classes
-- ============================================================

PRAGMA foreign_keys = ON;
-- enable cascade deletes and relational integrity
PRAGMA journal_mode = WAL;
-- improves performance for concurrent reads/writes



-- ============================================
-- USERS  (User Management)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Types.UserId
    username TEXT UNIQUE NOT NULL, -- login handle
    passwordHash TEXT NOT NULL, -- hashed password
    displayName TEXT UNIQUE NOT NULL, -- unique public name
    avatarUrl TEXT, -- nullable, default NULL by registration
    lastSeenAt INTEGER NOT NULL DEFAULT 0, -- 0 = never seen, >0 = last activity time
    deletedAt INTEGER NOT NULL DEFAULT 0 -- 0 = active, >0 = GDPR deletion time
);

CREATE UNIQUE INDEX IF NOT EXISTS u_users_username_nocase ON users (username COLLATE NOCASE);

CREATE UNIQUE INDEX IF NOT EXISTS u_users_display_nocase ON users (displayName COLLATE NOCASE);




-- ============================================
-- LOGIN session key(set in cookie instead user/pass)
-- ============================================

CREATE TABLE IF NOT EXISTS login_sessions (
    id TEXT PRIMARY KEY, -- random string (cookie value)
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ())
);

CREATE INDEX IF NOT EXISTS i_login_sessions_user ON login_sessions (userId);




-- ============================================
-- FRIENDS  (User friend list: directed)
-- ============================================

CREATE TABLE IF NOT EXISTS friends (
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    friendId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    CHECK (userId <> friendId),
    PRIMARY KEY (userId, friendId)
);




-- ============================================
-- BLOCKS  (User block list directed)
-- ============================================

CREATE TABLE IF NOT EXISTS blocks (
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    blockedId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    CHECK (userId <> blockedId),
    PRIMARY KEY (userId, blockedId) -- WHERE userId = ? => uses the PK index = who I blocked
);

--  who blocks me? / am I blocked by X?
CREATE INDEX IF NOT EXISTS idx_blocks_blockedId ON blocks (blockedId);




-- ============================================
-- CHAT  (public + DMs + invites)
-- ============================================
-- Store everything in one table; “invite to game” is a message
-- with type='PrivateGameInviteMsg' and optional JSON in meta.
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (
        type IN (
            'PrivateMessage',
            'PrivateGameInviteMessage',
            'TournamentMessage'
        )
    ),
    senderId TEXT NOT NULL, -- users.id or a fixed SystemId string
    receiverId TEXT NOT NULL, 
    content TEXT NOT NULL, -- message text OR short invite note
    meta TEXT, -- JSON: { "sender":"abc", "message": "hello", ... } or null
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ())
);

CREATE INDEX IF NOT EXISTS i_messages_conv_createdAt
    ON messages (senderId, receiverId, createdAt);

-- ============================================
-- GAMES  (all stored 1v1 matches for stats)
-- ============================================
-- One row = one finished game.
-- 
-- UserId:
-- real user = user id
-- guest/AI = NULL
-- 
-- round:
--   NULL               -> normal game
--   'semi'   -> tournament semi-final
--   'final'  -> tournament final
-- 
--    users are "deleted" by soft delete (deletedAt + anonymized name),
--     so we normally never DELETE from users. Old games remain valid for stats.
-- ============================================
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    -- game type
    mode TEXT NOT NULL
        CHECK (mode IN ('normalGame', 'tournament')),

    -- null for normal games, 'semi' or 'final' for tournaments
    tournamentRound TEXT,

    -- null for guest/AI players, or if user hard-deleted
    winnerUserId TEXT REFERENCES users (id) ON DELETE SET NULL,
    loserUserId  TEXT REFERENCES users (id) ON DELETE SET NULL,

    -- aliases as shown in UI at the time of the game
    winnerAlias TEXT NOT NULL,
    loserAlias  TEXT NOT NULL,

    -- scores
    winnerScore INTEGER NOT NULL,
    loserScore  INTEGER NOT NULL,

    createdAt INTEGER NOT NULL DEFAULT (unixepoch()),

    -- consistency between mode and tournamentRound
    CHECK (
      (mode = 'normalGame' AND tournamentRound IS NULL)
      OR
      (mode = 'tournament' AND tournamentRound IN ('semi','final'))
    ),

    -- basic score sanity: non-negative and winner really wins
    CHECK (winnerScore >= 0 AND loserScore >= 0 AND winnerScore > loserScore)
);

CREATE INDEX IF NOT EXISTS i_games_winnerUserId ON games (winnerUserId);
CREATE INDEX IF NOT EXISTS i_games_loserUserId  ON games (loserUserId);
CREATE INDEX IF NOT EXISTS i_games_createdAt    ON games (createdAt);
