#!/usr/bin/env bash

# 0. Make it executable: chmod +x backend/tests/chat.sh
# 1. In 1st terminal: make backend
# 2. In 2nd terminal: make backend-tests

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMP_DIR:-./.tmp_cookies}"
mkdir -p "$TMP_DIR"

ALICE_COOKIE="$TMP_DIR/cookies_alice.txt"
BOB_COOKIE="$TMP_DIR/cookies_bob.txt"
CAROL_COOKIE="$TMP_DIR/cookies_carol.txt"
DAVE_COOKIE="$TMP_DIR/cookies_dave.txt"

echo "cookies at: $TMP_DIR"

# ===== Adjust these to your real API routes =====
USERS_URL="$BASE_URL/users"
AUTH_REGISTER_URL="$BASE_URL/auth/register"
AUTH_LOGIN_URL="$BASE_URL/auth/login"
FRIENDS_URL="$BASE_URL/friends"
BLOCKS_URL="$BASE_URL/blocks"

# Chat endpoints (ADAPT to your real ones)
CHAT_SEND_URL="$BASE_URL/messages"                  # POST {type, receiverId, content, meta}
CHAT_INBOX_URL="$BASE_URL/messages/inbox"           # GET
CHAT_DIRECT_URL="$BASE_URL/messages/direct"         # GET /messages/direct/:otherUserId
CHAT_TOURNAMENT_URL="$BASE_URL/messages/tournament" # optional; placeholder

# GDPR delete endpoint (ADAPT to your real route)
DELETE_ME_URL="$BASE_URL/users/me"   # DELETE (or PATCH) to anonymize/delete account

jq_or_cat() { if command -v jq >/dev/null 2>&1; then jq; else cat; fi; }
hr() { echo "------------------------------------------------------------"; }

echo "=== 0) Protected chat route without cookie → expect 401 ==="
hr
curl -i -sS "$CHAT_INBOX_URL" | sed -n '1,10p' || true
echo

echo "=== 1) Register users (idempotent; OK if already exist) ==="
hr
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"bob","displayName":"Bob","passwordPlain":"Str0ngPass!","avatarUrl":null}'   | jq_or_cat || true
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"carol","displayName":"Carol","passwordPlain":"Str0ngPass!","avatarUrl":null}'| jq_or_cat || true
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"dave","displayName":"Dave","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
echo

echo "=== 2) Login each and save cookies ==="
hr
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}' -c "$ALICE_COOKIE" | jq_or_cat
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"bob","passwordPlain":"Str0ngPass!"}'   -c "$BOB_COOKIE"   | jq_or_cat
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"carol","passwordPlain":"Str0ngPass!"}' -c "$CAROL_COOKIE" | jq_or_cat
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"dave","passwordPlain":"Str0ngPass!"}'  -c "$DAVE_COOKIE"  | jq_or_cat
echo

echo "=== 3) GET /users (as Alice) and extract IDs ==="
hr
USERS_JSON="$(curl -sS "$USERS_URL" -b "$ALICE_COOKIE")"
echo "$USERS_JSON" | jq_or_cat
echo

ALICE_ID="$(echo "$USERS_JSON" | jq -r 'map(select(.displayName=="Alice"))[0].id // empty' 2>/dev/null || true)"
BOB_ID="$(echo "$USERS_JSON"   | jq -r 'map(select(.displayName=="Bob"))[0].id   // empty' 2>/dev/null || true)"
CAROL_ID="$(echo "$USERS_JSON" | jq -r 'map(select(.displayName=="Carol"))[0].id // empty' 2>/dev/null || true)"
DAVE_ID="$(echo "$USERS_JSON"  | jq -r 'map(select(.displayName=="Dave"))[0].id  // empty' 2>/dev/null || true)"

echo "ALICE_ID=$ALICE_ID"
echo "BOB_ID=$BOB_ID"
echo "CAROL_ID=$CAROL_ID"
echo "DAVE_ID=$DAVE_ID"
if [[ -z "${ALICE_ID:-}" || -z "${BOB_ID:-}" || -z "${CAROL_ID:-}" || -z "${DAVE_ID:-}" ]]; then
  echo "Could not determine user IDs from /users. Aborting." >&2
  exit 1
fi
echo

echo "=== 4) Inbox as Alice initially → expect empty or few system messages ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 5) Alice sends direct message to Bob ==="
hr
curl -sS -X POST "$CHAT_SEND_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$BOB_ID",
  "content": "Hi Bob, this is Alice!",
  "meta": null
}
EOF
)" | jq_or_cat || true
echo

echo "=== 6) Bob inbox after Alice message — should include DM from Alice ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$BOB_COOKIE" | jq_or_cat || true
echo

echo "=== 7) Bob replies to Alice (DM in both directions) ==="
hr
curl -sS -X POST "$CHAT_SEND_URL" -b "$BOB_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$ALICE_ID",
  "content": "Hi Alice, got your message!",
  "meta": null
}
EOF
)" | jq_or_cat || true
echo

echo "=== 8) Conversation Alice ↔ Bob (as Alice) ==="
hr
# Assumes /messages/direct/:userId
curl -sS "$CHAT_DIRECT_URL/$BOB_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 9) Conversation Alice ↔ Bob (as Bob) ==="
hr
curl -sS "$CHAT_DIRECT_URL/$ALICE_ID" -b "$BOB_COOKIE" | jq_or_cat || true
echo

echo "=== 10) Attempt to send empty content (validation) — expect 400 ==="
hr
curl -i -sS -X POST "$CHAT_SEND_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$BOB_ID",
  "content": "",
  "meta": null
}
EOF
)" | sed -n '1,20p' || true
echo

echo "=== 11) Send to non-existent user ID — expect 400/404 ==="
hr
curl -i -sS -X POST "$CHAT_SEND_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "non_existing_user_id_123",
  "content": "Should fail",
  "meta": null
}
EOF
)" | sed -n '1,20p' || true
echo

echo "=== 12) Alice and Bob add each other as friends (optional, for UI sanity) ==="
hr
curl -sS -X POST "$FRIENDS_URL/$BOB_ID"   -b "$ALICE_COOKIE" | jq_or_cat || true
curl -sS -X POST "$FRIENDS_URL/$ALICE_ID" -b "$BOB_COOKIE"   | jq_or_cat || true
echo

echo "=== 13) Carol sends DM to Alice (baseline before blocks) ==="
hr
curl -sS -X POST "$CHAT_SEND_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$ALICE_ID",
  "content": "Hi Alice, this is Carol.",
  "meta": null
}
EOF
)" | jq_or_cat || true
echo

echo "=== 14) Alice inbox after Carol message — should include DM from Carol ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 15) Alice blocks Carol → POST /blocks/:id ==="
hr
curl -sS -X POST "$BLOCKS_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 16) Carol tries to send DM to Alice while blocked — expect 400/403 and no new message ==="
hr
curl -i -sS -X POST "$CHAT_SEND_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$ALICE_ID",
  "content": "You should NOT see this (Carol → Alice blocked).",
  "meta": null
}
EOF
)" | sed -n '1,20p' || true
echo

echo "=== 17) Alice inbox after blocked Carol tries again — should NOT contain new Carol message ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 18) Alice unblocks Carol → DELETE /blocks/:id ==="
hr
curl -sS -X DELETE "$BLOCKS_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 19) Carol sends DM after unblock — should succeed again ==="
hr
curl -sS -X POST "$CHAT_SEND_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$ALICE_ID",
  "content": "Now unblocked, hello again!",
  "meta": null
}
EOF
)" | jq_or_cat || true
echo

echo "=== 20) Alice inbox after unblock — should show new Carol DM ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 21) Game invite: Alice invites Bob to Pong via chat (PrivateGameInviteMessage) ==="
hr
curl -sS -X POST "$CHAT_SEND_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateGameInviteMessage",
  "receiverId": "$BOB_ID",
  "content": "Invite: Pong BO3, fast ball",
  "meta": {
    "mode": "bo3",
    "ballSpeed": "fast",
    "map": "classic"
  }
}
EOF
)" | jq_or_cat || true
echo

echo "=== 22) Bob inbox — should include invite message from Alice with meta ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$BOB_COOKIE" | jq_or_cat || true
echo

echo "=== 23) Block effect on game invite: Alice blocks Dave, Dave tries to invite Alice ==="
hr
curl -sS -X POST "$BLOCKS_URL/$DAVE_ID" -b "$ALICE_COOKIE" | jq_or_cat || true

curl -i -sS -X POST "$CHAT_SEND_URL" -b "$DAVE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateGameInviteMessage",
  "receiverId": "$ALICE_ID",
  "content": "Dave → Alice invite (should be blocked).",
  "meta": { "mode": "bo1", "ballSpeed": "normal" }
}
EOF
)" | sed -n '1,20p' || true
echo

echo "=== 24) Alice inbox — should NOT contain Dave invite ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "=== 25) GDPR / Account Deletion: Carol sends DM to Dave, then deletes herself ==="
hr
curl -sS -X POST "$CHAT_SEND_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$DAVE_ID",
  "content": "Hi Dave, Carol here before deletion.",
  "meta": null
}
EOF
)" | jq_or_cat || true
echo

echo "=== 26) Dave inbox — should show Carol DM ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$DAVE_COOKIE" | jq_or_cat || true
echo

echo "=== 27) Carol deletes her account (GDPR) → DELETE /users/me (ADAPT if needed) ==="
hr
curl -i -sS -X DELETE "$DELETE_ME_URL" -b "$CAROL_COOKIE" | sed -n '1,20p' || true
echo

echo "=== 28) Carol tries to send message after deletion — expect 401/403 ==="
hr
curl -i -sS -X POST "$CHAT_SEND_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$ALICE_ID",
  "content": "I am deleted, this should fail.",
  "meta": null
}
EOF
)" | sed -n '1,20p' || true
echo

echo "=== 29) Alice tries to send message TO deleted Carol ID — expect 400/404 ==="
hr
curl -i -sS -X POST "$CHAT_SEND_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "PrivateMessage",
  "receiverId": "$CAROL_ID",
  "content": "Message to deleted Carol should fail or be anonymized.",
  "meta": null
}
EOF
)" | sed -n '1,20p' || true
echo

echo "=== 30) Dave inbox after Carol deletion — existing Carol messages should still be visible, but sender may be anonymized depending on GDPR logic ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$DAVE_COOKIE" | jq_or_cat || true
echo

echo "=== 31) Tournament messages simulation: system/tournament notification broadcast ==="
hr
# This assumes your backend allows a normal user to POST TournamentMessage
# for testing. In reality, these will probably be created by the tournament system.
curl -sS -X POST "$CHAT_SEND_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "type": "TournamentMessage",
  "receiverId": "all",
  "content": "Tournament #42: Next match Alice vs Bob in 2 minutes.",
  "meta": {
    "tournamentId": "42",
    "round": 1,
    "players": ["$ALICE_ID", "$BOB_ID"]
  }
}
EOF
)" | jq_or_cat || true
echo

echo "=== 32) Tournament message visible in Bob inbox (notification from chat) ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$BOB_COOKIE" | jq_or_cat || true
echo

echo "=== 33) Tournament message visible in Alice inbox ==="
hr
curl -sS "$CHAT_INBOX_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "✅ Chat tests done."
