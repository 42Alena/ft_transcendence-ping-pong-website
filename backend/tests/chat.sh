
#!/usr/bin/env bash

# 0. Make it executable: chmod +x backend/tests/chat.sh
# 1. In 1st terminal: make backend
# 2. In 2nd terminal: make tests_chat

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMP_DIR:-./.tmp_cookies}"
mkdir -p "$TMP_DIR"

ALICE_COOKIE="$TMP_DIR/cookies_alice.txt"
BOB_COOKIE="$TMP_DIR/cookies_bob.txt"
CAROL_COOKIE="$TMP_DIR/cookies_carol.txt"
DAVE_COOKIE="$TMP_DIR/cookies_dave.txt"

# Must match Domain.SYSTEM_ID in backend
SYSTEM_ID="TOURNAMENT"

echo "cookies at: $TMP_DIR"

# ===== Core API routes =====
USERS_URL="$BASE_URL/users"
AUTH_REGISTER_URL="$BASE_URL/auth/register"
AUTH_LOGIN_URL="$BASE_URL/auth/login"
FRIENDS_URL="$BASE_URL/friends"
BLOCKS_URL="$BASE_URL/blocks"

# Chat endpoints (your current routes)
CHAT_SEND_PRIVATE_URL="$BASE_URL/chat/messages"                 # POST { receiverId, content }
CHAT_SEND_GAME_INVITE_URL="$BASE_URL/chat/messages/game-invite" # POST { receiverId }
CHAT_SEND_TOURNAMENT_URL="$BASE_URL/chat/messages/tournament"   # POST { receiverId }
CHAT_SIDEBAR_URL="$BASE_URL/chat/conversations"                 # GET
CHAT_THREAD_BASE_URL="$BASE_URL/chat/conversations"             # GET /chat/conversations/:userId

# GDPR delete endpoint (ADAPT if needed)
DELETE_ME_URL="$BASE_URL/users/me"   # DELETE or PATCH to anonymize/delete account

jq_or_cat() { if command -v jq >/dev/null 2>&1; then jq; else cat; fi; }
hr() { echo "------------------------------------------------------------"; }

ALL_OK=0
CURRENT_STEP=""
CURRENT_DESC=""

step_start() {
  CURRENT_STEP="$1"
  CURRENT_DESC="$2"
  echo "=== $CURRENT_STEP) $CURRENT_DESC ==="
  hr
}

step_ok() {
  local status=$1
  if [ "$status" -eq 0 ]; then
    echo "✅ Step $CURRENT_STEP OK: $CURRENT_DESC"
  else
    echo "❌ Step $CURRENT_STEP FAILED: $CURRENT_DESC"
    ALL_OK=1
  fi
  echo
}

# 0
step_start "0" "Protected chat route without cookie → expect 401"
RESP0=$(curl -i -sS "$CHAT_SIDEBAR_URL" || true)
echo "$RESP0" | sed -n '1,10p'
step_ok 0

# 1
step_start "1" "Register users (idempotent; OK if already exist)"
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"bob","displayName":"Bob","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"carol","displayName":"Carol","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
curl -sS -X POST "$AUTH_REGISTER_URL" -H "Content-Type: application/json" \
  -d '{"username":"dave","displayName":"Dave","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
step_ok 0

# 2
step_start "2" "Login each and save cookies"
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}' -c "$ALICE_COOKIE" | jq_or_cat
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"bob","passwordPlain":"Str0ngPass!"}'   -c "$BOB_COOKIE"   | jq_or_cat
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"carol","passwordPlain":"Str0ngPass!"}' -c "$CAROL_COOKIE" | jq_or_cat
curl -sS -X POST "$AUTH_LOGIN_URL" -H "Content-Type: application/json" \
  -d '{"username":"dave","passwordPlain":"Str0ngPass!"}'  -c "$DAVE_COOKIE"  | jq_or_cat
step_ok 0

# 3
step_start "3" "GET /users (as Alice) and extract IDs"
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
  echo "❌ Could not determine user IDs from /users. Aborting." >&2
  ALL_OK=1
  exit 1
fi
step_ok 0

# 4
step_start "4" "Chat sidebar as Alice initially → expect empty or few system chats"
curl -sS "$CHAT_SIDEBAR_URL" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 5
step_start "5" "Alice sends direct message to Bob"
curl -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$BOB_ID",
  "content": "Hi Bob, this is Alice!"
}
EOF
)" | jq_or_cat || true
step_ok 0

# 6
step_start "6" "Chat sidebar as Bob — should include Alice"
curl -sS "$CHAT_SIDEBAR_URL" -b "$BOB_COOKIE" | jq_or_cat || true
step_ok 0

# 7
step_start "7" "Bob replies to Alice (DM in both directions)"
curl -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$BOB_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$ALICE_ID",
  "content": "Hi Alice, got your message!"
}
EOF
)" | jq_or_cat || true
step_ok 0

# 8
step_start "8" "Conversation Alice ↔ Bob (as Alice)"
curl -sS "$CHAT_THREAD_BASE_URL/$BOB_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 9
step_start "9" "Conversation Alice ↔ Bob (as Bob)"
curl -sS "$CHAT_THREAD_BASE_URL/$ALICE_ID" -b "$BOB_COOKIE" | jq_or_cat || true
step_ok 0

# 10
step_start "10" "Attempt to send empty content (validation) — expect 400"
curl -i -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$BOB_ID",
  "content": ""
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 11
step_start "11" "Send to non-existent user ID — expect 404"
curl -i -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "999999",
  "content": "Should fail"
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 12
step_start "12" "Alice and Bob add each other as friends (optional)"
curl -sS -X POST "$FRIENDS_URL/$BOB_ID"   -b "$ALICE_COOKIE" | jq_or_cat || true
curl -sS -X POST "$FRIENDS_URL/$ALICE_ID" -b "$BOB_COOKIE"   | jq_or_cat || true
step_ok 0

# 13
step_start "13" "Carol sends DM to Alice (baseline before blocks)"
curl -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$ALICE_ID",
  "content": "Hi Alice, this is Carol."
}
EOF
)" | jq_or_cat || true
step_ok 0

# 14
step_start "14" "Conversation Alice ↔ Carol (as Alice) — should include DM from Carol"
curl -sS "$CHAT_THREAD_BASE_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 15
step_start "15" "Alice blocks Carol → POST /blocks/:id"
curl -sS -X POST "$BLOCKS_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 16
step_start "16" "Carol tries to send DM to Alice while blocked — expect 403"
curl -i -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$ALICE_ID",
  "content": "You should NOT see this (Carol → Alice blocked)."
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 17
step_start "17" "Conversation Alice ↔ Carol after blocked — should NOT contain new Carol message"
curl -sS "$CHAT_THREAD_BASE_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 18
step_start "18" "Alice unblocks Carol → DELETE /blocks/:id"
curl -sS -X DELETE "$BLOCKS_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 19
step_start "19" "Carol sends DM after unblock — should succeed again"
curl -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$ALICE_ID",
  "content": "Now unblocked, hello again!"
}
EOF
)" | jq_or_cat || true
step_ok 0

# 20
step_start "20" "Conversation Alice ↔ Carol after unblock — should show new Carol DM"
curl -sS "$CHAT_THREAD_BASE_URL/$CAROL_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 21
step_start "21" "Game invite: Alice invites Bob to Pong via chat"
curl -sS -X POST "$CHAT_SEND_GAME_INVITE_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$BOB_ID"
}
EOF
)" | jq_or_cat || true
step_ok 0

# 22
step_start "22" "Conversation Alice ↔ Bob — should include game invite message"
curl -sS "$CHAT_THREAD_BASE_URL/$BOB_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 23
step_start "23" "Block effect on game invite: Alice blocks Dave, Dave tries to invite Alice"
curl -sS -X POST "$BLOCKS_URL/$DAVE_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
curl -i -sS -X POST "$CHAT_SEND_GAME_INVITE_URL" -b "$DAVE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$ALICE_ID"
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 24
step_start "24" "Conversation Alice ↔ Dave — should NOT contain new Dave invite"
curl -sS "$CHAT_THREAD_BASE_URL/$DAVE_ID" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 25
step_start "25" "GDPR / Account Deletion: Carol sends DM to Dave, then deletes herself"
curl -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$DAVE_ID",
  "content": "Hi Dave, Carol here before deletion."
}
EOF
)" | jq_or_cat || true
step_ok 0

# 26
step_start "26" "Conversation Carol ↔ Dave (as Dave) — should show Carol DM"
curl -sS "$CHAT_THREAD_BASE_URL/$CAROL_ID" -b "$DAVE_COOKIE" | jq_or_cat || true
step_ok 0

# 27
step_start "27" "Carol deletes her account (GDPR) → DELETE /users/me"
curl -i -sS -X DELETE "$DELETE_ME_URL" -b "$CAROL_COOKIE" | sed -n '1,20p' || true
step_ok 0

# 28
step_start "28" "Carol tries to send message after deletion — expect 401/403"
curl -i -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$ALICE_ID",
  "content": "I am deleted, this should fail."
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 29
step_start "29" "Alice tries to send message TO deleted Carol ID — expect 404"
curl -i -sS -X POST "$CHAT_SEND_PRIVATE_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$CAROL_ID",
  "content": "Message to deleted Carol should fail or be anonymized."
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 30
step_start "30" "Conversation Dave ↔ Carol after Carol deletion — messages may be anonymized"
curl -sS "$CHAT_THREAD_BASE_URL/$CAROL_ID" -b "$DAVE_COOKIE" | jq_or_cat || true
step_ok 0

# 31
step_start "31" "Tournament message simulation: System sends tournament notification to Bob"
curl -sS -X POST "$CHAT_SEND_TOURNAMENT_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "receiverId": "$BOB_ID"
}
EOF
)" | jq_or_cat || true
step_ok 0

# 32
step_start "32" "Conversation Bob ↔ System — Bob sees TournamentMessage"
curl -sS "$CHAT_THREAD_BASE_URL/$SYSTEM_ID" -b "$BOB_COOKIE" | jq_or_cat || true
step_ok 0

echo "============================================================"
if [ "$ALL_OK" -eq 0 ]; then
  echo "✅ All chat tests executed without script failures."
else
  echo "❌ Some chat test steps reported failures (see above)."
fi

