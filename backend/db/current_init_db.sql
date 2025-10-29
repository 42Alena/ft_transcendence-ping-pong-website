-- ============================================================
-- (Alena) Final working schema aligned with TypeScript classes
-- ============================================================

PRAGMA foreign_keys = ON;
-- enable cascade deletes and relational integrity
PRAGMA journal_mode = WAL;
-- improves performance for concurrent reads/writes

-- =========================
-- USERS  (User Management)
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Types.UserId
    username TEXT UNIQUE NOT NULL, -- login handle
    passwordHash TEXT NOT NULL, -- hashed password
    displayName TEXT UNIQUE NOT NULL, -- unique public name
    avatarUrl TEXT, -- optional
    lastSeenAt INTEGER, -- epoch; derive "online"
    deletedAt INTEGER NOT NULL DEFAULT 0, -- GDPR soft-delete flag
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ()),
    updatedAt INTEGER NOT NULL DEFAULT(unixepoch ())
);

CREATE UNIQUE INDEX IF NOT EXISTS u_users_username_nocase ON users (username COLLATE NOCASE);

CREATE UNIQUE INDEX IF NOT EXISTS u_users_display_nocase ON users (displayName COLLATE NOCASE);

-- =========================
-- LOGIN session key(set in cookie instead user/pass)
-- =========================
CREATE TABLE IF NOT EXISTS login_sessions (
  id        TEXT PRIMARY KEY,                              -- random string (cookie value)
  userId    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expiresAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS i_login_sessions_expires ON login_sessions(expiresAt);
CREATE INDEX IF NOT EXISTS i_login_sessions_user    ON login_sessions(userId);


-- =========================
-- FRIENDS  (User friend list)
-- =========================
CREATE TABLE IF NOT EXISTS friends (
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    friendId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ()),
    PRIMARY KEY (userId, friendId),
    CHECK (userId <> friendId)
);

-- =========================
-- BLOCKS  (User block list)
-- =========================
CREATE TABLE IF NOT EXISTS blocks (
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    blockedId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ()),
    PRIMARY KEY (userId, blockedId),
    CHECK (userId <> blockedId)
);

-- =========================
-- CHAT  (public + DMs + invites)
-- Store everything in one table; “invite to game” is a message
-- with type='PrivateGameInviteMsg' and optional JSON in meta.
-- =========================
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK (
        type IN (
            'PublicMsg',
            'PrivateMsg',
            'PrivateGameInviteMsg'
        )
    ),
    senderId TEXT NOT NULL, -- users.id or a fixed SystemId string
    receiverId TEXT NOT NULL, -- 'all' for public, or users.id for DM/invite
    content TEXT NOT NULL, -- message text OR short invite note
    meta TEXT, -- JSON: { "mode":"classic", "speed":1.2, ... }
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ())
);

-- ============================================
-- TOURNAMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- unique tournament ID
    name TEXT NOT NULL, -- tournament name (set by frontend)
    createdAt INTEGER NOT NULL DEFAULT(unixepoch ()) -- creation timestamp for history
);

-- ============================================
-- TOURNAMENT PLAYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournamentPlayers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- record ID for each participant
    tournamentId INTEGER NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE, -- link to tournament
    userId TEXT REFERENCES users (id) ON DELETE SET NULL, -- UserId of player (nullable for alias-only)
    alias TEXT, -- alias used for display in brackets
    isWinner INTEGER NOT NULL DEFAULT 0 -- 1 if player won (used for final results)
);

-- (Luis) Added tournamentMatches table to track individual matches within tournaments
-- Each match links to a tournament and records player scores
-- ============================================
-- TOURNAMENT MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournamentMatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- record ID for each match
    tournamentId INTEGER NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE, -- link to tournament
    roundNumber INTEGER NOT NULL CHECK (roundNumber >= 1), -- round index (1-based)
    player1Id TEXT REFERENCES users (id) ON DELETE SET NULL, -- UserId of player 1 (nullable for alias-only)
    player2Id TEXT REFERENCES users (id) ON DELETE SET NULL, -- UserId of player 2 (nullable for alias-only)
    -- winnerId is determined by scores
    player1Score INTEGER NOT NULL DEFAULT 0, -- score of player 1
    player2Score INTEGER NOT NULL DEFAULT 0 -- score of player 2
);

-- (Luis) Added userStatistics table to track individual player performance
-- Each entry links to a user and records their match statistics
-- ============================================
-- USER STATISTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS userStatistics (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- record ID for each statistics entry
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE, -- UserId of the player
    matchesPlayed INTEGER NOT NULL DEFAULT 0, -- total matches played
    matchesWon INTEGER NOT NULL DEFAULT 0, -- total matches won
    matchesLost INTEGER NOT NULL DEFAULT 0, -- total matches lost
    pointsScored INTEGER NOT NULL DEFAULT 0, -- total points scored
    pointsConceded INTEGER NOT NULL DEFAULT 0 -- total points conceded
);

-- ============================================
-- GDPR REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gdprRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- request record ID
    userId TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE, -- affected user (linked to Users table)
    is_anonymous BOOLEAN NOT NULL DEFAULT 0, -- whether the user requested anonymity or not
    gdpr_consent BOOLEAN NOT NULL DEFAULT 0, -- whether the user gave GDPR consent or not
    delete_requested BOOLEAN NOT NULL DEFAULT 0, -- whether the user requested account deletion or not
    action TEXT NOT NULL CHECK (
        action IN ('anonymize', 'delete')
    ), -- type of GDPR operation
    requestedAt INTEGER NOT NULL DEFAULT(unixepoch ()) -- when the request was made
);