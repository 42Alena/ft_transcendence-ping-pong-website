# 0. Make it executable: chmod +x backend/tests/users.sh
# 1. run in terminal: backend/tests/users.sh

#!/usr/bin/env bash
# backend/tests/users.sh
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMP_DIR:-./.tmp_cookies}"
mkdir -p "$TMP_DIR"

ALICE_COOKIE="$TMP_DIR/cookies_alice.txt"
BOB_COOKIE="$TMP_DIR/cookies_bob.txt"
CAROL_COOKIE="$TMP_DIR/cookies_carol.txt"

echo "cookies at: $TMP_DIR"

jq_or_cat() { if command -v jq >/dev/null 2>&1; then jq; else cat; fi; }

hr() { echo "------------------------------------------------------------"; }

echo "=== 0) Protected route without cookie → expect 401 ==="
hr
curl -i -sS "$BASE_URL/users" | sed -n '1,5p' || true
echo

echo "=== 1) Register with errors (missing fields) → expect 400 ==="
hr
curl -sS -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{}' | jq_or_cat || true
echo

echo "=== 2) Register users (idempotent; OK if already exist) ==="
hr
curl -sS -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordPlain":"Str0ngPass!","avatarUrl":null}' | jq_or_cat || true
curl -sS -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" \
  -d '{"username":"bob","displayName":"Bob","passwordPlain":"Str0ngPass!","avatarUrl":null}'   | jq_or_cat || true
curl -sS -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" \
  -d '{"username":"carol","displayName":"Carol","passwordPlain":"Str0ngPass!","avatarUrl":null}'| jq_or_cat || true
echo

echo "=== 3) Login each and save cookies ==="
hr
curl -sS -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}' -c "$ALICE_COOKIE" | jq_or_cat
curl -sS -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" \
  -d '{"username":"bob","passwordPlain":"Str0ngPass!"}'   -c "$BOB_COOKIE"   | jq_or_cat
curl -sS -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" \
  -d '{"username":"carol","passwordPlain":"Str0ngPass!"}' -c "$CAROL_COOKIE" | jq_or_cat
echo

echo "=== 4) GET /users (as Alice) ==="
hr
USERS_JSON="$(curl -sS "$BASE_URL/users" -b "$ALICE_COOKIE")"
echo "$USERS_JSON" | jq_or_cat
echo

# Pick Alice's id from the list (or first entry as fallback)
ALICE_ID="$(echo "$USERS_JSON" | jq -r 'map(select(.displayName=="Alice"))[0].id // empty' 2>/dev/null || true)"
if [[ -z "${ALICE_ID:-}" ]]; then
  ALICE_ID="$(echo "$USERS_JSON" | jq -r '.[0].id' 2>/dev/null || true)"
fi
if [[ -z "${ALICE_ID:-}" || "$ALICE_ID" == "null" ]]; then
  echo "Could not determine a user id from /users. Aborting." >&2
  exit 1
fi
echo "Detected Alice ID: $ALICE_ID"
echo

echo "=== 5) GET /users/:id (Bob views Alice) ==="
hr
curl -sS "$BASE_URL/users/$ALICE_ID" -b "$BOB_COOKIE" | jq_or_cat
echo

echo "=== 6) GET /users/me (as Alice) ==="
hr
# Uncomment this if you’ve implemented /users/me on the server:
curl -sS "$BASE_URL/users/me" -b "$ALICE_COOKIE" | jq_or_cat || true
echo

echo "✅ Done."
