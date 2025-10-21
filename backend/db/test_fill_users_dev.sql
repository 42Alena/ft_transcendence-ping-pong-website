-- Fill the users table with N fake rows for local development.
-- Change the N in "WHERE n < 15" to any count you want.

WITH RECURSIVE
    nums (n) AS (
        SELECT 1
        UNION ALL
        SELECT n + 1
        FROM nums
        WHERE
            n < 5
    )
INSERT INTO
    users (
        id,
        username,
        displayName,
        passwordHash,
        avatarUrl
    )
SELECT
    lower(hex(randomblob (12))) AS id, -- random 24-hex id
    'user' || n AS username, -- user1..user15
    'userPublic' || n AS displayName, -- user1..user15
    '$2a$10$dummyhashdummyhashdummyhashdum' AS passwordHash, -- placeholder to satisfy NOT NULL
    '' AS avatarUrl
FROM nums;