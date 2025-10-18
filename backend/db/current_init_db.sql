-- ============================================================
-- ft_transcendence — Active Database Schema
-- (Alena) Final working schema aligned with TypeScript classes
-- ============================================================

PRAGMA foreign_keys = ON;      -- enable cascade deletes and relational integrity
PRAGMA journal_mode = WAL;     -- improves performance for concurrent reads/writes

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                            -- unique string generated in User class (User.id)
  username TEXT UNIQUE NOT NULL,                  -- User.name (display name for login/profile)
  passwordHash TEXT NOT NULL,                     -- hashed password stored securely by backend
  avatarUrl TEXT,                                 -- optional user image (used in User.avatarUrl)
  -- Alena online/offline /not in db./ laschange after last activity, update each time last activity. Not active after 10min
  -- userStatus TEXT NOT NULL DEFAULT 'online'       -- 'online' | 'offline' (User.userStatus)
  --   CHECK (userStatus IN ('online', 'offline')),
  -- add last activity date/time
  -- add user created timestamp
  isDeleted INTEGER NOT NULL DEFAULT 0            -- GDPR deletion flag (used in account anonymization)
);

-- ============================================
-- RELATIONS TABLE (friends + blocks)
-- ============================================
CREATE TABLE IF NOT EXISTS relations (
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- main user performing the action
  otherId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- target user (friend or blocked)
  relation TEXT NOT NULL CHECK (relation IN ('friend','block')), -- 'friend' or 'block' type (UserManager.addFriend / blockId)
  PRIMARY KEY (userId, otherId, relation)                        -- ensures unique relation pair
);

-- ============================================
-- MESSAGES TABLE (live chat)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- unique message ID (used by Chat)
  type TEXT NOT NULL CHECK (type IN                             -- message category: from Types.MessageType
    ('PublicMsg','PrivateMsg','PrivateGameInviteMsg','TournamentMsg')),
  -- add time of msg send
  senderId TEXT NOT NULL,                                       -- UserId of sender (Chat.checkPrivateSender)
  receiverId TEXT NOT NULL,                                     -- UserId or 'all' (Chat.checkPrivateReceiver)
  content TEXT NOT NULL                                         -- message body (Chat.send*Message methods)
);

-- ============================================
-- TOURNAMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- unique tournament ID
  name TEXT NOT NULL,                                           -- tournament name (set by frontend)
  createdAt INTEGER NOT NULL DEFAULT (unixepoch())              -- creation timestamp for history
);

-- ============================================
-- TOURNAMENT PLAYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournamentPlayers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- record ID for each participant
  tournamentId INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE, -- link to tournament
  userId TEXT REFERENCES users(id) ON DELETE SET NULL,          -- UserId of player (nullable for alias-only)
  alias TEXT,                                                   -- alias used for display in brackets
  isWinner INTEGER NOT NULL DEFAULT 0                           -- 1 if player won (used for final results)
);

-- (Luis) Added tournamentMatches table to track individual matches within tournaments
-- Each match links to a tournament and records player scores
-- ============================================
-- TOURNAMENT MATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tournamentMatches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- record ID for each match
  tournamentId INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE, -- link to tournament
  roundNumber INTEGER NOT NULL CHECK (roundNumber >= 1),        -- round index (1-based)
  player1Id TEXT REFERENCES users(id) ON DELETE SET NULL,       -- UserId of player 1 (nullable for alias-only)
  player2Id TEXT REFERENCES users(id) ON DELETE SET NULL        -- UserId of player 2 (nullable for alias-only)
  -- winnerId is determined by scores
  player1Score INTEGER NOT NULL DEFAULT 0,                      -- score of player 1
  player2Score INTEGER NOT NULL DEFAULT 0                       -- score of player 2
);

-- (Luis) Added userStatistics table to track individual player performance
-- Each entry links to a user and records their match statistics
-- ============================================
-- USER STATISTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS userStatistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- record ID for each statistics entry
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- UserId of the player
  matchesPlayed INTEGER NOT NULL DEFAULT 0,                     -- total matches played
  matchesWon INTEGER NOT NULL DEFAULT 0,                        -- total matches won
  matchesLost INTEGER NOT NULL DEFAULT 0,                        -- total matches lost
  pointsScored INTEGER NOT NULL DEFAULT 0,                       -- total points scored
  pointsConceded INTEGER NOT NULL DEFAULT 0                      -- total points conceded
);

-- ============================================
-- GDPR REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gdprRequests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- request record ID
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- affected user (linked to Users table)
  is_anonymous BOOLEAN NOT NULL DEFAULT 0,                      -- whether the user requested anonymity or not
  gdpr_consent BOOLEAN NOT NULL DEFAULT 0,                      -- whether the user gave GDPR consent or not
  delete_requested BOOLEAN NOT NULL DEFAULT 0,                  -- whether the user requested account deletion or not
  action TEXT NOT NULL CHECK (action IN ('anonymize','delete')),-- type of GDPR operation
  requestedAt INTEGER NOT NULL DEFAULT (unixepoch())            -- when the request was made
);

