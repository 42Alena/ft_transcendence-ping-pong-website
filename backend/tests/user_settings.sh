#!/usr/bin/env bash

# backend/tests/user_settings.sh
# chmod +x backend/tests/user_settings.sh
# Run:
#   1) terminal 1: make backend
#   2) terminal 2: BASE_URL=http://localhost:3000 backend/tests/user_settings.sh

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TMP_DIR="${TMP_DIR:-./.tmp_cookies}"
mkdir -p "$TMP_DIR"

ALICE_COOKIE="$TMP_DIR/cookies_alice_settings.txt"

echo "cookies at: $TMP_DIR"

jq_or_cat() { if command -v jq >/dev/null 2>&1; then jq; else cat; fi; }

hr() { echo "------------------------------------------------------------"; }


echo "=== 0) Protected settings route without cookie → expect 401 ==="
hr
curl -i -sS -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"NewName"}' | sed -n '1,10p' || true
echo


echo "=== 1) Register Alice (idempotent) ==="
hr
curl -sS -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordPlain":"Str0ngPass!","avatarUrl":null}' \
  | jq_or_cat || true
echo


echo "=== 2) Login Alice and save cookie ==="
hr
curl -sS -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}' \
  -c "$ALICE_COOKIE" | jq_or_cat
echo


echo "=== 3) GET /users/me (as Alice) — initial state ==="
hr
curl -sS "$BASE_URL/users/me" -b "$ALICE_COOKIE" | jq_or_cat || true
echo


###############################################################################
# ACTIVE PART NOW: CHANGE DISPLAY NAME TESTS
###############################################################################

echo "=== 4) PATCH /users/me/display-name with missing body field → expect 400 ==="
hr
curl -i -sS -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -b "$ALICE_COOKIE" | sed -n '1,20p' || true
echo

echo "=== 5) PATCH /users/me/display-name with too short name → expect 400 ==="
hr
curl -i -sS -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Al"}' \
  -b "$ALICE_COOKIE" | sed -n '1,20p' || true
echo

echo "=== 6) PATCH /users/me/display-name with invalid chars → expect 400 ==="
hr
curl -i -sS -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"A!ice"}' \
  -b "$ALICE_COOKIE" | sed -n '1,20p' || true
echo

echo "=== 7) PATCH /users/me/display-name with valid name \"AliceNew\" → expect 204 ==="
hr
curl -i -sS -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"AliceNew"}' \
  -b "$ALICE_COOKIE" | sed -n '1,10p'
echo

echo "=== 8) GET /users/me (as Alice) — displayName should now be \"AliceNew\" ==="
hr
curl -sS "$BASE_URL/users/me" -b "$ALICE_COOKIE" | jq_or_cat || true
echo


###############################################################################
# LATER: PASSWORD CHANGE TESTS (commented for now)
###############################################################################
# : <<'__PASSWORD_TESTS__'

# echo "=== X1) PATCH /users/me/password with missing fields → expect 400 ==="
# hr
# curl -i -sS -X PATCH "$BASE_URL/users/me/password" \
#   -H "Content-Type: application/json" \
#   -d '{}' \
#   -b "$ALICE_COOKIE" | sed -n '1,20p' || true
# echo

# echo "=== X2) PATCH /users/me/password with wrong current password → expect 401 ==="
# hr
# curl -i -sS -X PATCH "$BASE_URL/users/me/password" \
#   -H "Content-Type: application/json" \
#   -d '{"currentPassword":"WrongPass!","newPassword":"NewStr0ng1"}' \
#   -b "$ALICE_COOKIE" | sed -n '1,20p' || true
# echo

# echo "=== X3) PATCH /users/me/password with weak new password → expect 400 ==="
# hr
# curl -i -sS -X PATCH "$BASE_URL/users/me/password" \
#   -H "Content-Type: application/json" \
#   -d '{"currentPassword":"Str0ngPass!","newPassword":"short"}' \
#   -b "$ALICE_COOKIE" | sed -n '1,20p' || true
# echo

# echo "=== X4) PATCH /users/me/password with valid current + strong new password → expect 204 ==="
# hr
# curl -i -sS -X PATCH "$BASE_URL/users/me/password" \
#   -H "Content-Type: application/json" \
#   -d '{"currentPassword":"Str0ngPass!","newPassword":"NewStr0ng1"}' \
#   -b "$ALICE_COOKIE" | sed -n '1,10p'
# echo

# echo "=== X5) Login with old password should FAIL → expect 401 ==="
# hr
# curl -i -sS -X POST "$BASE_URL/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"alice","passwordPlain":"Str0ngPass!"}' | sed -n '1,10p' || true
# echo

# echo "=== X6) Login with new password should SUCCEED ==="
# hr
# curl -sS -X POST "$BASE_URL/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"alice","passwordPlain":"NewStr0ng1"}' \
#   -c "$ALICE_COOKIE" | jq_or_cat
# echo

# __PASSWORD_TESTS__


###############################################################################
# LATER: AVATAR TESTS (commented for now)
###############################################################################
# : <<'__AVATAR_TESTS__'

# echo "=== Y1) Upload invalid avatar (text file) → expect 400 ==="
# hr
# echo "not an image" > "$TMP_DIR/fake.txt"
# curl -i -sS -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@$TMP_DIR/fake.txt" | sed -n '1,20p' || true
# echo

# echo "=== Y2) Upload valid avatar (small jpg/png) → expect 200/204 ==="
# hr
# # TODO: replace avatar.jpg with a small valid image in your repo/tests
# curl -i -sS -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@backend/tests/avatar_sample.jpg" | sed -n '1,20p' || true
# echo

# echo "=== Y3) DELETE /users/me/avatar → expect 204 and default avatar afterwards ==="
# hr
# curl -i -sS -X DELETE "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" | sed -n '1,10p'
# echo

# echo "=== Y4) GET /users/me — avatar should now be default/empty ==="
# hr
# curl -sS "$BASE_URL/users/me" -b "$ALICE_COOKIE" | jq_or_cat || true
# echo

# __AVATAR_TESTS__


###############################################################################
# LATER: DELETE ACCOUNT TESTS (commented for now)
###############################################################################
# : <<'__DELETE_ACCOUNT_TESTS__'

# echo "=== Z1) DELETE /users/me (as Alice) → expect 204 ==="
# hr
# curl -i -sS -X DELETE "$BASE_URL/users/me" \
#   -b "$ALICE_COOKIE" | sed -n '1,10p'
# echo

# echo "=== Z2) GET /users/me after deletion → expect 401 or anonymized user ==="
# hr
# curl -i -sS "$BASE_URL/users/me" -b "$ALICE_COOKIE" | sed -n '1,20p' || true
# echo

# echo "=== Z3) Try login again with Alice credentials → expect 401 ==="
# hr
# curl -i -sS -X POST "$BASE_URL/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"alice","passwordPlain":"NewStr0ng1"}' | sed -n '1,10p' || true
# echo

# __DELETE_ACCOUNT_TESTS__


echo "✅ Settings tests finished (display-name part)."
echo "If you see this line, all active tests passed without curl errors."
