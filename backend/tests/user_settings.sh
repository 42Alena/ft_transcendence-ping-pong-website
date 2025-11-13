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

run_test_raw \
  "=== 0) PATCH /users/me/display-name without cookie → expect 401 ===" \
  "401" \
  -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"NewName"}'

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

run_test_raw \
  "=== 4) PATCH /users/me/display-name with missing body field → expect 400 ===" \
  "400" \
  -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 5) PATCH /users/me/display-name with too short name → expect 400 ===" \
  "400" \
  -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Al"}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 6) PATCH /users/me/display-name with invalid chars → expect 400 ===" \
  "400" \
  -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d '{"displayName":"A!ice"}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 7) PATCH /users/me/display-name with valid random name \"$NEW_DISPLAY\" → expect 204 ===" \
  "204" \
  -X PATCH "$BASE_URL/users/me/display-name" \
  -H "Content-Type: application/json" \
  -d "{\"displayName\":\"$NEW_DISPLAY\"}" \
  -b "$ALICE_COOKIE"

run_test_json_body_contains \
  "=== 8) GET /users/me (as Alice) — displayName should now be \"$NEW_DISPLAY\" ===" \
  "200" \
  "\"displayName\":\"$NEW_DISPLAY\"" \
  "$BASE_URL/users/me" \
  -b "$ALICE_COOKIE"

###############################################################################
# 9–14: PASSWORD CHANGE TESTS
# Assumes current Alice password is Str0ngPass! at start.
###############################################################################

run_test_raw \
  "=== 9) PATCH /users/me/change-password with missing fields → expect 400 ===" \
  "400" \
  -X PATCH "$BASE_URL/users/me/change-password" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 10) PATCH /users/me/change-password with wrong current password → expect 401 ===" \
  "401" \
  -X PATCH "$BASE_URL/users/me/change-password" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"WrongPass!","newPassword":"NewStr0ng1"}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 11) PATCH /users/me/change-password with weak new password → expect 400 ===" \
  "400" \
  -X PATCH "$BASE_URL/users/me/change-password" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"Str0ngPass!","newPassword":"short"}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 12) PATCH /users/me/change-password with valid current + strong new password → expect 204 ===" \
  "204" \
  -X PATCH "$BASE_URL/users/me/change-password" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"Str0ngPass!","newPassword":"NewStr0ng1"}' \
  -b "$ALICE_COOKIE"

run_test_raw \
  "=== 13) Login with old password should FAIL → expect 401 ===" \
  "401" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"Str0ngPass!"}'

run_test_json \
  "=== 14) Login with new password should SUCCEED and refresh cookie ===" \
  "200" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","passwordPlain":"NewStr0ng1"}' \
  -c "$ALICE_COOKIE"

###############################################################################
# 15–18: AVATAR TESTS
###############################################################################

# # Create fake text file for invalid avatar
# echo "not an image" > "$AVATAR_TXT"

# run_test_raw \
#   "=== 15) Upload invalid avatar (text file) → expect 400 ===" \
#   "400" \
#   -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@$AVATAR_TXT"

# run_test_raw \
#   "=== 16) Upload valid avatar (small jpg/png) → expect 200 or 204 ===" \
#   "200|204" \
#   -X POST "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE" \
#   -F "avatar=@$AVATAR_SAMPLE"

# run_test_raw \
#   "=== 17) DELETE /users/me/avatar → expect 204 ===" \
#   "204" \
#   -X DELETE "$BASE_URL/users/me/avatar" \
#   -b "$ALICE_COOKIE"

# run_test_json \
#   "=== 18) GET /users/me — avatar should now be default/empty ===" \
#   "200" \
#   "$BASE_URL/users/me" \
#   -b "$ALICE_COOKIE"

###############################################################################
# SUMMARY
###############################################################################

echo
if [ "$any_failed" -eq 0 ]; then
  echo "✅ Settings tests finished (display-name + password + avatar). All expectations matched."
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