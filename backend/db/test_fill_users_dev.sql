-- Fill the users table with N fake rows for local development.
-- Change the N in "WHERE n < 15" to any count you want.

WITH RECURSIVE nums(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 5
)
INSERT OR IGNORE INTO users (
  id, username, passwordHash, avatarUrl, userStatus, isDeleted
)
SELECT
  lower(hex(randomblob(12))) AS id,            -- random 24-hex id
  'user' || n                 AS username,     -- user1..user15
  '$2a$10$dummyhashdummyhashdummyhashdum' AS passwordHash,  -- placeholder to satisfy NOT NULL
  ''                          AS avatarUrl,
  'online'                    AS userStatus,   -- must be 'online' or 'offline'
  0                           AS isDeleted
FROM nums;
