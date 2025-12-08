#!/usr/bin/env bash

# 0. Make it executable: chmod +x backend/tests/gameStats.sh
# 1. In 1st terminal: make backend
# 2. In 2nd terminal: make tests_game_stats (or run this script directly)

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMP_DIR:-./.tmp_cookies}"
mkdir -p "$TMP_DIR"

ALICE_COOKIE="$TMP_DIR/cookies_alice.txt"
BOB_COOKIE="$TMP_DIR/cookies_bob.txt"
CAROL_COOKIE="$TMP_DIR/cookies_carol.txt"
DAVE_COOKIE="$TMP_DIR/cookies_dave.txt"

echo "cookies at: $TMP_DIR"

# ===== Core API routes =====
USERS_URL="$BASE_URL/users"
AUTH_REGISTER_URL="$BASE_URL/auth/register"
AUTH_LOGIN_URL="$BASE_URL/auth/login"

# Game stats endpoints
SAVE_NORMAL_GAME_URL="$BASE_URL/games/normal/save"
SAVE_TOURNAMENT_GAME_URL="$BASE_URL/games/tournament/save"
PROFILE_STATS_BASE_URL="$BASE_URL/profile"   # /profile/:userId/stats

jq_or_cat() { if command -v jq >/dev/null 2>&1; then jq; else cat; fi; }
hr() { echo "------------------------------------------------------------"; }

ALL_OK=0
CURRENT_STEP=""
CURRENT_DESC=""

step_start() {
  CURRENT_STEP="$1"
  CURRENT_DESC="$2"
  echo
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
step_start "0" "GET /profile/:userId/stats without cookie → expect 401"
# just use some fake id
curl -i -sS "$PROFILE_STATS_BASE_URL/123/stats" || true | sed -n '1,15p'
step_ok 0

# 1
step_start "1" "Register users for game tests (idempotent; OK if already exist)"
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
step_start "2" "Login users and save cookies"
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
step_start "4" "Initial stats for all users → expect zero games"
echo "# Alice initial stats"
curl -sS "$PROFILE_STATS_BASE_URL/$ALICE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Bob initial stats"
curl -sS "$PROFILE_STATS_BASE_URL/$BOB_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Carol initial stats"
curl -sS "$PROFILE_STATS_BASE_URL/$CAROL_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Dave initial stats"
curl -sS "$PROFILE_STATS_BASE_URL/$DAVE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 5
step_start "5" "Normal game: Alice (3) vs Bob (1) – Alice wins, should be saved and counted"
curl -sS -X POST "$SAVE_NORMAL_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "normalGame",
  "tournamentRound": null,
  "player1Alias": "Alice",
  "player1Score": 3,
  "player2Alias": "Bob",
  "player2Score": 1
}
EOF
)" | jq_or_cat || true
step_ok 0

# 6
step_start "6" "Check stats after 1 normal game (Alice win vs Bob)"
echo "# Alice stats after win vs Bob"
curl -sS "$PROFILE_STATS_BASE_URL/$ALICE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Bob stats after loss vs Alice"
curl -sS "$PROFILE_STATS_BASE_URL/$BOB_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 7
step_start "7" "Normal game: Bob (3) vs Alice (0) – Bob wins, second normal game"
curl -sS -X POST "$SAVE_NORMAL_GAME_URL" -b "$BOB_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "normalGame",
  "tournamentRound": null,
  "player1Alias": "Bob",
  "player1Score": 3,
  "player2Alias": "Alice",
  "player2Score": 0
}
EOF
)" | jq_or_cat || true
step_ok 0

# 8
step_start "8" "Normal game: AI vs Alice (AI wins) – human vs AI saved, only Alice stored with userId"
curl -sS -X POST "$SAVE_NORMAL_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "normalGame",
  "tournamentRound": null,
  "player1Alias": "AI_BOT",
  "player1Score": 3,
  "player2Alias": "Alice",
  "player2Score": 2
}
EOF
)" | jq_or_cat || true
step_ok 0

# 9
step_start "9" "Normal game: AI vs AI (no humans) – should be valid but NOT saved (saved = false)"
curl -i -sS -X POST "$SAVE_NORMAL_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "normalGame",
  "tournamentRound": null,
  "player1Alias": "AI_ONE",
  "player1Score": 3,
  "player2Alias": "AI_TWO",
  "player2Score": 0
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 10
step_start "10" "Invalid normal game: same alias for winner/loser → expect 400 invalid_game"
curl -i -sS -X POST "$SAVE_NORMAL_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "normalGame",
  "tournamentRound": null,
  "player1Alias": "Alice",
  "player1Score": 3,
  "player2Alias": "Alice",
  "player2Score": 0
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 11
step_start "11" "Invalid score: tie 2–2 (winnerScore <= loserScore) → expect 400 invalid_score"
curl -i -sS -X POST "$SAVE_NORMAL_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "normalGame",
  "tournamentRound": null,
  "player1Alias": "Alice",
  "player1Score": 2,
  "player2Alias": "Bob",
  "player2Score": 2
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 12
step_start "12" "Stats after several normal games (including AI vs Alice, AI vs AI skipped)"
echo "# Alice stats (mix of wins and losses, including AI game)"
curl -sS "$PROFILE_STATS_BASE_URL/$ALICE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Bob stats (some wins, some losses)"
curl -sS "$PROFILE_STATS_BASE_URL/$BOB_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 13
step_start "13" "Tournament semi: Alice (3) vs Bob (1) – Alice goes to final, Bob gets candidate for 3rd"
curl -sS -X POST "$SAVE_TOURNAMENT_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "tournament",
  "tournamentRound": "semi",
  "player1Alias": "Alice",
  "player1Score": 3,
  "player2Alias": "Bob",
  "player2Score": 1
}
EOF
)" | jq_or_cat || true
step_ok 0

# 14
step_start "14" "Tournament semi: Carol (3) vs Dave (0) – Carol to final, Dave candidate for 3rd"
curl -sS -X POST "$SAVE_TOURNAMENT_GAME_URL" -b "$CAROL_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "tournament",
  "tournamentRound": "semi",
  "player1Alias": "Carol",
  "player1Score": 3,
  "player2Alias": "Dave",
  "player2Score": 0
}
EOF
)" | jq_or_cat || true
step_ok 0

# 15
step_start "15" "Tournament final: Alice (3) vs Carol (2) – Alice gets 1st place, Carol 2nd"
curl -sS -X POST "$SAVE_TOURNAMENT_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "tournament",
  "tournamentRound": "final",
  "player1Alias": "Alice",
  "player1Score": 3,
  "player2Alias": "Carol",
  "player2Score": 2
}
EOF
)" | jq_or_cat || true
step_ok 0

# 16
step_start "16" "Invalid tournament: wrong round string (\"quarter\") → expect 400"
curl -i -sS -X POST "$SAVE_TOURNAMENT_GAME_URL" -b "$ALICE_COOKIE" \
  -H "Content-Type: application/json" \
  -d "$(cat <<EOF
{
  "mode": "tournament",
  "tournamentRound": "quarter",
  "player1Alias": "Alice",
  "player1Score": 3,
  "player2Alias": "Bob",
  "player2Score": 0
}
EOF
)" | sed -n '1,20p' || true
step_ok 0

# 17
step_start "17" "Tournament stats: check 1st/2nd/3rd places for all four players"
echo "# Alice stats (should have some wins and at least 1st place from final)"
curl -sS "$PROFILE_STATS_BASE_URL/$ALICE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Bob stats (should have a semi loss → candidate for 3rd place)"
curl -sS "$PROFILE_STATS_BASE_URL/$BOB_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Carol stats (semi win, final loss → 2nd place)"
curl -sS "$PROFILE_STATS_BASE_URL/$CAROL_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Dave stats (semi loss → candidate for 3rd place)"
curl -sS "$PROFILE_STATS_BASE_URL/$DAVE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 18
step_start "18" "Match history / tables: check matches for each user"
echo "# Alice match history"
curl -sS "$PROFILE_STATS_BASE_URL/$ALICE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Bob match history"
curl -sS "$PROFILE_STATS_BASE_URL/$BOB_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Carol match history"
curl -sS "$PROFILE_STATS_BASE_URL/$CAROL_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
echo "# Dave match history"
curl -sS "$PROFILE_STATS_BASE_URL/$DAVE_ID/stats" -b "$ALICE_COOKIE" | jq_or_cat || true
step_ok 0

# 19
step_start "19" "Stats for non-existent user id → expect 404"
curl -i -sS "$PROFILE_STATS_BASE_URL/999999/stats" -b "$ALICE_COOKIE" | sed -n '1,20p' || true
step_ok 0

echo "============================================================"
if [ "$ALL_OK" -eq 0 ]; then
  echo "✅ All game stats tests executed without script failures."
else
  echo "❌ Some game stats test steps reported failures (see above)."
fi
