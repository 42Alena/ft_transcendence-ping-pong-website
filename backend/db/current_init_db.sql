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
  userStatus TEXT NOT NULL DEFAULT 'online'       -- 'online' | 'offline' (User.userStatus)
    CHECK (userStatus IN ('online', 'offline')),
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

-- ============================================
-- GDPR REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gdprRequests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,                         -- request record ID
  userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- affected user (linked to Users table)
  action TEXT NOT NULL CHECK (action IN ('anonymize','delete')),-- type of GDPR operation
  requestedAt INTEGER NOT NULL DEFAULT (unixepoch())            -- when the request was made
);

