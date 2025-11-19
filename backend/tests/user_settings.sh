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

# Random display name for the "valid change" test:
# - must be 3–10 chars (validator rule)
# - "Al" + RANDOM → length 3–7
NEW_DISPLAY="Al$RANDOM"

# For avatar tests:
AVATAR_TXT="$TMP_DIR/fake_avatar.txt"
AVATAR_SAMPLE="backend/tests/avatar_sample.jpg"  # make sure this file exists

echo "cookies at: $TMP_DIR"

jq_or_cat() { if command -v jq >/dev/null 2>&1; then jq; else cat; fi; }

hr() { echo "------------------------------------------------------------"; }
sep() {
  echo
  echo "________________________"
}

any_failed=0

# expected can be:
#  - "200"     → exact match
#  - "200|204" → any of these
#  - "SKIP"    → don't enforce HTTP code
print_result() {
  local expected="$1"
  local got="$2"

  echo "Expected HTTP: $expected"
  echo "Got      HTTP: $got"

  if [ "$expected" = "SKIP" ]; then
    echo "Result   : not checked (SKIP) ℹ️"
    echo
    return 0
  fi

  local ok=1

  if [[ "$expected" == *"|"* ]]; then
    # multiple allowed codes: like 200|204
    local code
    for code in ${expected//|/ }; do
      if [ "$got" = "$code" ]; then
        ok=0
        break
      fi
    done
  else
    # single code
    if [ "$got" = "$expected" ]; then
      ok=0
    fi
  fi

  if [ $ok -eq 0 ]; then
    echo "Result   : OK ✅"
  else
    echo "Result   : WRONG ❌"
    any_failed=1
  fi
  echo
}

# RAW: headers + body, single request, status from same request
run_test_raw() {
  # $1 = title, $2 = expected HTTP code (or SKIP), $3... = curl args
  local title="$1"
  local expected="$2"
  shift 2

  sep
  echo "$title"
  hr

  local tmp http_code
  tmp="$(mktemp)"

  echo "--- Response ---"
  http_code="$(curl -sS -o "$tmp" -w '%{http_code}' -i "$@")"
  cat "$tmp"
  echo
  rm -f "$tmp" || true

  print_result "$expected" "$http_code"
}

# JSON: body only, single request, status from same request
run_test_json() {
  # $1 = title, $2 = expected HTTP code (or SKIP), $3... = curl args
  local title="$1"
  local expected="$2"
  shift 2

  sep
  echo "$title"
  hr

  local tmp http_code
  tmp="$(mktemp)"

  echo "--- Response (JSON body) ---"
  http_code="$(curl -sS -o "$tmp" -w '%{http_code}' "$@")"
  cat "$tmp" | jq_or_cat || true
  echo
  rm -f "$tmp" || true

  print_result "$expected" "$http_code"
}

# JSON + body contains substring, single request
run_test_json_body_contains() {
  # $1 = title, $2 = expected HTTP, $3 = expected substring, $4... = curl args
  local title="$1"
  local expected_http="$2"
  local expected_sub="$3"
  shift 3

  sep
  echo "$title"
  hr

  local tmp http_code
  tmp="$(mktemp)"

  echo "--- Response (JSON body) ---"
  http_code="$(curl -sS -o "$tmp" -w '%{http_code}' "$@")"
  cat "$tmp" | jq_or_cat || true
  echo

  print_result "$expected_http" "$http_code"

  echo "Body expected to contain: $expected_sub"
  if grep -q "$expected_sub" "$tmp"; then
    echo "Body check: OK ✅"
  else
    echo "Body check: WRONG ❌"
    any_failed=1
  fi
  rm -f "$tmp" || true
  echo
}

###############################################################################
# HEADER ABOUT THESE TESTS
###############################################################################

echo
echo
echo "============================================================"
echo " USER SETTINGS TESTS"
echo " - auth + /users/me"
echo " - change display name (validation + success)"
echo " - change password (validation + success)"
echo " - avatar upload + delete"
echo "   * displayName length rule 3–10 chars"
echo
echo " BASE_URL     : $BASE_URL"
echo " TMP_DIR      : $TMP_DIR"
echo " NEW_DISPLAY  : $NEW_DISPLAY"
echo " AVATAR_SAMPLE: $AVATAR_SAMPLE"
echo "============================================================"
echo

###############################################################################
# 0–8: DISPLAY NAME TESTS
###############################################################################

# run_test_raw \
#   "=== 0) PATCH /users/me/display-name without cookie → expect 401 ===" \
#   "401" \
#   -X PATCH "$BASE_URL/users/me/display-name" \
#   -H "Content-Type: application/json" \
#   -d '{"displayName":"NewName"}'

run_test_json \
  "=== 1) Register Alice (idempotent) ===" \
  "SKIP" \
  -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","displayName":"Alice","passwordPlain":"Str0ngPass!","avatarUrl":null}'

run_test_json \
  "=== 2) Login Alice and save cookie ===" \
  "200" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}' \
  -c "$ALICE_COOKIE"

run_test_json \
  "=== 3) GET /users/me (as Alice) — initial state ===" \
  "200" \
  "$BASE_URL/users/me" \
  -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 4) PATCH /users/me/display-name with missing body field → expect 400 ===" \
#   "400" \
#   -X PATCH "$BASE_URL/users/me/display-name" \
#   -H "Content-Type: application/json" \
#   -d '{}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 5) PATCH /users/me/display-name with too short name → expect 400 ===" \
#   "400" \
#   -X PATCH "$BASE_URL/users/me/display-name" \
#   -H "Content-Type: application/json" \
#   -d '{"displayName":"Al"}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 6) PATCH /users/me/display-name with invalid chars → expect 400 ===" \
#   "400" \
#   -X PATCH "$BASE_URL/users/me/display-name" \
#   -H "Content-Type: application/json" \
#   -d '{"displayName":"A!ice"}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 7) PATCH /users/me/display-name with valid random name \"$NEW_DISPLAY\" → expect 204 ===" \
#   "204" \
#   -X PATCH "$BASE_URL/users/me/display-name" \
#   -H "Content-Type: application/json" \
#   -d "{\"displayName\":\"$NEW_DISPLAY\"}" \
#   -b "$ALICE_COOKIE"

# run_test_json_body_contains \
#   "=== 8) GET /users/me (as Alice) — displayName should now be \"$NEW_DISPLAY\" ===" \
#   "200" \
#   "\"displayName\":\"$NEW_DISPLAY\"" \
#   "$BASE_URL/users/me" \
#   -b "$ALICE_COOKIE"

###############################################################################
# 9–14: PASSWORD CHANGE TESTS
# Assumes current Alice password is Str0ngPass! at start.
###############################################################################

# run_test_raw \
#   "=== 9) PATCH /users/me/change-password with missing fields → expect 400 ===" \
#   "400" \
#   -X PATCH "$BASE_URL/users/me/change-password" \
#   -H "Content-Type: application/json" \
#   -d '{}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 10) PATCH /users/me/change-password with wrong current password → expect 401 ===" \
#   "401" \
#   -X PATCH "$BASE_URL/users/me/change-password" \
#   -H "Content-Type: application/json" \
#   -d '{"currentPassword":"WrongPass!","newPassword":"NewStr0ng1"}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 11) PATCH /users/me/change-password with weak new password → expect 400 ===" \
#   "400" \
#   -X PATCH "$BASE_URL/users/me/change-password" \
#   -H "Content-Type: application/json" \
#   -d '{"currentPassword":"Str0ngPass!","newPassword":"short"}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 12) PATCH /users/me/change-password with valid current + strong new password → expect 204 ===" \
#   "204" \
#   -X PATCH "$BASE_URL/users/me/change-password" \
#   -H "Content-Type: application/json" \
#   -d '{"currentPassword":"Str0ngPass!","newPassword":"NewStr0ng1"}' \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 13) Login with old password should FAIL → expect 401 ===" \
#   "401" \
#   -X POST "$BASE_URL/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"alice","passwordPlain":"Str0ngPass!"}'

# run_test_json \
#   "=== 14) Login with new password should SUCCEED and refresh cookie ===" \
#   "200" \
#   -X POST "$BASE_URL/auth/login" \
#   -H "Content-Type: application/json" \
#   -d '{"username":"alice","passwordPlain":"NewStr0ng1"}' \
#   -c "$ALICE_COOKIE"

###############################################################################
# 15–18: AVATAR TESTS
###############################################################################
AVATARS_TEST_DIR="$(dirname "$0")/avatars_test"
AVATAR_INVALID="$AVATARS_TEST_DIR/avatar_invalid.txt"
AVATAR_VALID1="$AVATARS_TEST_DIR/avatar_valid1.png"
AVATAR_VALID2="$AVATARS_TEST_DIR/avatar_valid2.jpg"


# === AVATAR UPLOAD TESTS ================================================

# run_test_raw \
#   "=== 15) Upload invalid avatar (text file) → expect 400 ===" \
#   "400" \
#   -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@$AVATAR_INVALID"

run_test_raw \
  "=== 16) Upload valid avatar (PNG) → expect 200 or 204 ===" \
  "200|204" \
  -X POST "$BASE_URL/users/me/avatar" \
  -b "$ALICE_COOKIE" \
  -F "avatar=@$AVATAR_VALID1"

# run_test_raw \
#   "=== 17.1) Upload valid avatar (JPG, overwrite Alice avatar) → expect 200 or 204 ===" \
#   "200|204" \
#   -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@$AVATAR_VALID2"

# run_test_json_body_contains \
#   "=== 17.2) GET /users/me (as Alice) — avatarUrl should be set after upload ===" \
#   "200" \
#   '"avatarUrl":' \
#   "$BASE_URL/users/me" \
#   -b "$ALICE_COOKIE"

# run_test_raw \
#   "=== 18) Upload first valid avatar (JPG, overwrite Alice avatar) → expect 200 or 204 ===" \
#   "200|204" \
#   -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@$AVATAR_VALID1"


###############################################################################
# 19–26: DELETE ACCOUNT (GDPR) TESTS
###############################################################################

BOB_COOKIE="$TMP_DIR/cookies_bob_settings.txt"

# 19) Register Bob (idempotent)
run_test_json \
  "=== 19) Register Bob (idempotent) ===" \
  "SKIP" \
  -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","displayName":"Bob","passwordPlain":"Str0ngPass!","avatarUrl":null}'

# 20) Login Bob and save cookie
run_test_json \
  "=== 20) Login Bob and save cookie ===" \
  "200" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","passwordPlain":"Str0ngPass!"}' \
  -c "$BOB_COOKIE"

# Helper: extract "id" from /users/me without requiring jq
extract_id_from_me() {
  local cookie_file="$1"
  local json
  json="$(curl -sS "$BASE_URL/users/me" -b "$cookie_file")"
  echo "$json" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p'
}

echo
echo "=== 21) Extract Alice & Bob IDs from /users/me ==="
ALICE_ID="$(extract_id_from_me "$ALICE_COOKIE")"
BOB_ID="$(extract_id_from_me "$BOB_COOKIE")"

echo "Alice ID: $ALICE_ID"
echo "Bob   ID: $BOB_ID"
echo

if [ -z "$ALICE_ID" ] || [ -z "$BOB_ID" ]; then
  echo "❌ Could not extract Alice or Bob IDs from /users/me. Aborting delete-account tests."
  any_failed=1
else
  echo "IDs OK ✅"
fi

# 22) Bob adds Alice as friend (POST /friends/:id)
run_test_raw \
  "=== 22) Bob adds Alice as friend ===" \
  "200|204" \
  -X POST "$BASE_URL/friends/$ALICE_ID" \
  -b "$BOB_COOKIE"

# 23) Bob blocks Alice (POST /blocks/:id)
run_test_raw \
  "=== 23) Bob blocks Alice ===" \
  "200|204" \
  -X POST "$BASE_URL/blocks/$ALICE_ID" \
  -b "$BOB_COOKIE"

# 24) Check that Alice appears in Bob's friends & blocks BEFORE deletion
sep
echo "=== 24) Verify Alice is in Bob's friends & blocks BEFORE delete ==="
hr

BOB_FRIENDS_BEFORE="$(mktemp)"
BOB_BLOCKS_BEFORE="$(mktemp)"

curl -sS "$BASE_URL/users/me/friends" -b "$BOB_COOKIE" > "$BOB_FRIENDS_BEFORE"
curl -sS "$BASE_URL/users/me/blocks"  -b "$BOB_COOKIE" > "$BOB_BLOCKS_BEFORE"

echo "--- Bob friends BEFORE ---"
cat "$BOB_FRIENDS_BEFORE" | jq_or_cat || true
echo

echo "--- Bob blocks BEFORE ---"
cat "$BOB_BLOCKS_BEFORE" | jq_or_cat || true
echo

echo 'Expect friends to contain Alice ID'
if grep -q "\"$ALICE_ID\"" "$BOB_FRIENDS_BEFORE"; then
  echo "Friends BEFORE check: OK ✅"
else
  echo "Friends BEFORE check: WRONG ❌"
  any_failed=1
fi

echo 'Expect blocks to contain Alice ID'
if grep -q "\"$ALICE_ID\"" "$BOB_BLOCKS_BEFORE"; then
  echo "Blocks BEFORE check: OK ✅"
else
  echo "Blocks BEFORE check: WRONG ❌"
  any_failed=1
fi

rm -f "$BOB_FRIENDS_BEFORE" "$BOB_BLOCKS_BEFORE" || true
echo

# 25) Alice deletes her account (GDPR)
run_test_raw \
  "=== 25) DELETE /users/me as Alice (GDPR delete) → expect 204 ===" \
  "204" \
  -X DELETE "$BASE_URL/users/me" \
  -b "$ALICE_COOKIE"

# 26) Verify:
#   - Alice login fails
#   - Bob's friends & blocks no longer contain Alice
sep
echo "=== 26) Post-delete checks (login + friends/blocks cleanup) ==="
hr

# 26a) Alice login should now FAIL
run_test_raw \
  "=== 26a) Login as Alice after deletion → expect 401 ===" \
  "401" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}'

# 26b) Bob's friends and blocks should NOT contain Alice anymore
BOB_FRIENDS_AFTER="$(mktemp)"
BOB_BLOCKS_AFTER="$(mktemp)"

curl -sS "$BASE_URL/users/me/friends" -b "$BOB_COOKIE" > "$BOB_FRIENDS_AFTER"
curl -sS "$BASE_URL/users/me/blocks"  -b "$BOB_BLOCKS_AFTER"

echo "--- Bob friends AFTER ---"
cat "$BOB_FRIENDS_AFTER" | jq_or_cat || true
echo

echo "--- Bob blocks AFTER ---"
cat "$BOB_BLOCKS_AFTER" | jq_or_cat || true
echo

echo 'Expect friends NOT to contain Alice ID anymore'
if grep -q "\"$ALICE_ID\"" "$BOB_FRIENDS_AFTER"; then
  echo "Friends AFTER check: WRONG ❌ (still contains Alice ID)"
  any_failed=1
else
  echo "Friends AFTER check: OK ✅"
fi

echo 'Expect blocks NOT to contain Alice ID anymore'
if grep -q "\"$ALICE_ID\"" "$BOB_BLOCKS_AFTER"; then
  echo "Blocks AFTER check: WRONG ❌ (still contains Alice ID)"
  any_failed=1
fi

rm -f "$BOB_FRIENDS_AFTER" "$BOB_BLOCKS_AFTER" || true
echo

###############################################################################
# 27–36: ONLINE / OFFLINE STATUS TESTS
#  - assumes:
#      * Bob still exists and is logged in ($BOB_COOKIE, $BOB_ID)
#      * Alice was deleted (GDPR) and we still have $ALICE_ID
###############################################################################

CAROL_COOKIE="$TMP_DIR/cookies_carol_status.txt"
DAVE_COOKIE="$TMP_DIR/cookies_dave_status.txt"
 
 # 27) Register Carol (idempotent)
run_test_json \
  "=== 27) Register Carol (idempotent) ===" \
  "SKIP" \
  -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"carol1","displayName":"Carol","passwordPlain":"Str0ngPass!","avatarUrl":null}'


# 28) Login Carol and save cookie
run_test_json \
  "=== 28) Login Carol and save cookie ===" \
  "200" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"carol1","passwordPlain":"Str0ngPass!"}' \
  -c "$CAROL_COOKIE"




# 29) Register Dave (idempotent)
run_test_json \
  "=== 29) Register Dave (idempotent) ===" \
  "SKIP" \
  -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"dave1","displayName":"Dave","passwordPlain":"Str0ngPass!","avatarUrl":null}'

 
 
# 30) Login Dave and save cookie
run_test_json \
  "=== 30) Login Dave and save cookie ===" \
  "200" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"dave1","passwordPlain":"Str0ngPass!"}' \
  -c "$DAVE_COOKIE"

echo
echo "=== 31) Extract Carol & Dave IDs from /users/me ==="
CAROL_ID="$(extract_id_from_me "$CAROL_COOKIE")"
DAVE_ID="$(extract_id_from_me "$DAVE_COOKIE")"

echo "Carol ID: $CAROL_ID"
echo "Dave  ID: $DAVE_ID"
echo

if [ -z "$CAROL_ID" ] || [ -z "$DAVE_ID" ]; then
  echo "❌ Could not extract Carol or Dave IDs from /users/me. Aborting status tests."
  any_failed=1
else
  echo "IDs OK ✅"
fi

# 32) Carol adds Dave as friend so she is allowed to see his status
run_test_raw \
  "=== 32) Carol adds Dave as friend (for status visibility) ===" \
  "200|204" \
  -X POST "$BASE_URL/friends/$DAVE_ID" \
  -b "$CAROL_COOKIE"

# 33) FRIEND CASE: Carol checks Dave's status right after his login → expect ONLINE
run_test_json_body_contains \
  "=== 33) Carol checks Dave status right after login → expect ONLINE ===" \
  "200" \
  '"status":"online"' \
  "$BASE_URL/users/$DAVE_ID/status" \
  -b "$CAROL_COOKIE"

echo
echo "Waiting 7 seconds so Dave becomes OFFLINE (online timeout = 5s)..."
sleep 7

# 34) FRIEND CASE: Carol checks Dave's status after 20s inactivity → expect OFFLINE
run_test_json_body_contains \
  "=== 34) Carol checks Dave status after 20s inactivity → expect OFFLINE ===" \
  "200" \
  '"status":"offline"' \
  "$BASE_URL/users/$DAVE_ID/status" \
  -b "$CAROL_COOKIE"

# 35) NOT-FRIEND CASE: Bob asks Dave status → expect 403 or 404 (hidden for non-friends)
run_test_raw \
  "=== 35) Bob asks status of Dave (NOT a friend) → expect 403/404 (hidden) ===" \
  "403|404" \
  -X GET "$BASE_URL/users/$DAVE_ID/status" \
  -b "$BOB_COOKIE"

# 36) DELETED-ACCOUNT CASE: Bob asks status of deleted Alice → expect 404 (not_found)
run_test_raw \
  "=== 36) Bob asks status of deleted Alice → expect 404 (not_found) ===" \
  "404" \
  -X GET "$BASE_URL/users/$ALICE_ID/status" \
  -b "$BOB_COOKIE"


###############################################################################
# SUMMARY
###############################################################################

echo
if [ "$any_failed" -eq 0 ]; then
  echo "✅ Settings tests finished (display-name + password + avatar+ delete account  + online/offline). All expectations matched."
else
  echo "❌ Settings tests finished, but some expectations failed. Check logs above."
  exit 1
fi


# Notes 

# For avatar, just drop a small JPG/PNG into
# backend/tests/avatar_sample.jpg
# so test 16 can use it.

# Password tests assume initial password is Str0ngPass!.
# If you run the script multiple times on the same DB, either:

# reset the DB before tests, or

# manually set Alice’s password back.

# If you want, next step we can also add a small body check for avatar (e.g. "avatarUrl": field) once you know exactly how /users/me returns it.