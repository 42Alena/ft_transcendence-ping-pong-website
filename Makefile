.PHONY: all setup check-tools frontend backend db backend-tests \
        up down logs reset-db ps rebuild-backend db-tables db-ping\
		 db-fill db-wipe-users db-show-users db-count\
		 git-help git-main-update git-branch-update git-stats git-changes
SHELL := /bin/bash

FRONTEND_DIR := frontend
BACKEND_DIR  := backend
DB_DIR       := backend/db
DB_FILE := pong.db
DB_FILL 	 := $(DB_DIR)/test_fill_users_dev.sql
DB      := $(abspath $(DB_DIR)/$(DB_FILE))
DC           := docker compose
 
# git
GIT_REMOTE ?= origin
GIT_MAIN   ?= main

# Detect lockfiles to prefer reproducible installs
FRONT_LOCK := $(FRONTEND_DIR)/package-lock.json
BACK_LOCK  := $(BACKEND_DIR)/package-lock.json

#  builds + runs in detached mode
all: up 

# Install deps and initialize local SQLite DB (non-Docker flow)
setup: check-tools
	@echo "... Installing frontend dependencies ..."
	@if [ -f "$(FRONT_LOCK)" ]; then \
		cd "$(FRONTEND_DIR)" && npm ci; \
	else \
		cd "$(FRONTEND_DIR)" && npm install; \
	fi
	@echo "... Installing backend dependencies ..."
	@if [ -f "$(BACK_LOCK)" ]; then \
		cd "$(BACKEND_DIR)" && npm ci; \
	else \
		cd "$(BACKEND_DIR)" && npm install; \
	fi
	@$(MAKE) db

backend:
	cd "$(BACKEND_DIR)" && npm run start

frontend:
	cd "$(FRONTEND_DIR)" && \
	npm run compile && \
	npm run bundle && \
	npm run compile-css && \
	npm run serve

# old
# db: check-tools
# 	@rm $(DB_DIR)/pong.db*
# 	@chmod +x "$(DB_DIR)/setup_db.sh"
# 	cd "$(DB_DIR)" && ./setup_db.sh
	


db: check-tools
	@mkdir -p "$(DB_DIR)"
	@rm -f "$(DB_DIR)/$(DB_FILE)" "$(DB_DIR)/$(DB_FILE)-wal" "$(DB_DIR)/$(DB_FILE)-shm"
	@DB_PATH="$(DB)" "$(DB_DIR)/setup_db.sh"
# ___________TESTS__________________________________

# runs npm script "backend-tests" from $(BACKEND_DIR)/package.json (scripts.backend-tests)
# backend-tests:
# 	cd "$(BACKEND_DIR)" && npm run backend-tests

# old. TODO: check if needs

# tests: db
# 	cd "$(BACKEND_DIR)" &&  ./users.sh

tests_user_settings: db
	@chmod +x backend/tests/user_settings.sh
	@BASE_URL=http://localhost:3000 backend/tests/user_settings.sh

tests_users: db
	@chmod +x backend/tests/users.sh
	@BASE_URL=http://localhost:3000 backend/tests/users.sh

tests_chat: db
	@chmod +x backend/tests/chat.sh
	@BASE_URL=http://localhost:3000 backend/tests/chat.sh

tests_game_stats: db
	@chmod +x backend/tests/gameStats.sh
	@BASE_URL=http://localhost:3000 backend/tests/gameStats.sh

# ---- Tooling guards ---------------------------------------------------------
check-tools:
	@command -v node    >/dev/null 2>&1 || { echo "[Ooops..] node is not installed"; exit 1; }
	@command -v npm     >/dev/null 2>&1 || { echo "[Ooops..] npm is not installed";  exit 1; }
	@command -v sqlite3 >/dev/null 2>&1 || { echo "[Ooops..] sqlite3 is not installed"; exit 1; }
	@command -v docker  >/dev/null 2>&1 || { echo "[Ooops..] docker is not installed"; exit 1; }
	@echo "[OK] tools OK"

# --- Docker Compose ----------------------------------------------------------

# Run when starting the whole stack for development or evaluation (builds images and starts containers in background).
up:        ## build + start (detached)
	$(DC) up -d --build

# Run when stopping the stack but keeping the named volumes (so the SQLite DB persists).
down:      ## stop (keep DB volume)
	$(DC) down

# Run when you need to watch backend output in real time for debugging.
logs:      ## follow backend logs
	$(DC) logs -f backend

# Run when you want a fresh, empty database (drops volumes) and immediately bring everything back up.
reset-db:  ## stop + drop volumes (wipes SQLite) + start again
	$(DC) down -v
	$(DC) up -d --build

# Show running containers (status/ports).
ps:
	$(DC) ps -a

# Rebuild backend image (no cache), restart stack, show recent logs, status, and DB tables.
rebuild-backend:
	$(DC) down
	$(DC) build --no-cache backend
	$(DC) up -d
	$(DC) logs --tail=50 backend
	$(DC) ps
	$(DC) exec backend sh -lc 'sqlite3 /app/db/pong.db ".tables"'


# --- DB  SQLite----------------------------------------------------------
# Print SQLite tables from inside the backend container.
db-tables:
	$(DC) exec backend sh -lc 'sqlite3 /app/db/pong.db ".tables"'

# Quick DB ping: show DB path + SQLite version.
db-ping:
	$(DC) exec backend sh -lc 'echo "DB=/app/db/pong.db"; sqlite3 /app/db/pong.db "select sqlite_version();"'

# === Database: quick dev/test commands ===
db-fill:
	@sqlite3 "$(DB)" < "$(DB_FILL)" && echo "✔ Filled dev users from $(DB_FILL)"

db-wipe-users:
	@sqlite3 "$(DB)" "DELETE FROM users;" && echo "✔ Wiped users table"

db-show-users:
	@sqlite3 -header -csv "$(DB)" "SELECT id,username FROM users LIMIT 10;"

db-count:
	@sqlite3 "$(DB)" "SELECT COUNT(*) AS users FROM users;"



# GIT HELPFULL COMMANDS


git-help:
	@cur=$$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?"); \
	echo "Current branch: $$cur"; \
	echo ""; \
	printf "  %-20s %s\n" "git-main-update"   "(on $(GIT_MAIN)) Fetch --prune + fast-forward $(GIT_MAIN)"; \
	printf "  %-20s %s\n" "git-branch-update" "(on feature) Update $(GIT_MAIN), then merge $(GIT_MAIN) → current branch"; \
	printf "  %-20s %s\n" "git-stats"         "(any branch) Diff stats vs $(GIT_REMOTE)/$(GIT_MAIN) ... HEAD"; \
	printf "  %-20s %s\n" "git-changes"       "(any branch) List changed files vs $(GIT_REMOTE)/$(GIT_MAIN) ... HEAD"; \
	echo ""; \
	echo "Notes: no rebase, no force; main stays linear (pull --ff-only)."

# Must be run on 'main'. Fast-forward only.
git-main-update:
	@set -e; \
	cur=$$(git rev-parse --abbrev-ref HEAD); \
	[ "$$cur" = "$(GIT_MAIN)" ] || { echo "✖ You must be on '$(GIT_MAIN)' (now: $$cur)"; exit 1; }; \
	git fetch --prune $(GIT_REMOTE); \
	git pull --ff-only $(GIT_REMOTE) $(GIT_MAIN); \
	echo "✔ $(GIT_MAIN) is up-to-date with $(GIT_REMOTE)/$(GIT_MAIN)"

# Run on a feature branch: update main, then merge main → current branch (no rebase/force).
git-branch-update:
	@set -e; \
	if ! git diff --quiet || ! git diff --cached --quiet; then echo "✖ Working tree not clean. Commit or stash first."; exit 1; fi; \
	branch=$$(git rev-parse --abbrev-ref HEAD); \
	[ "$$branch" != "$(GIT_MAIN)" ] || { echo "✖ You are on '$(GIT_MAIN)'. Use 'make git-main-update' instead."; exit 1; }; \
	git fetch --prune $(GIT_REMOTE); \
	(git switch $(GIT_MAIN) >/dev/null 2>&1 || git checkout $(GIT_MAIN) >/dev/null); \
	git pull --ff-only $(GIT_REMOTE) $(GIT_MAIN); \
	(git switch "$$branch" >/dev/null 2>&1 || git checkout "$$branch" >/dev/null); \
	git merge --no-ff --no-edit $(GIT_MAIN) || { echo "⚠ Merge conflicts. Resolve and commit."; exit 1; }; \
	echo "✔ merged $(GIT_MAIN) → $$branch"

# Read-only: short summary like "3 files changed, 12 insertions(+), 7 deletions(-)"
git-stats:
	@set -e; \
	git fetch --prune $(GIT_REMOTE) >/dev/null; \
	git diff --shortstat $(GIT_REMOTE)/$(GIT_MAIN)...HEAD || true

# Read-only: list changed files with status (A/M/D/R...)
git-changes:
	@set -e; \
	git fetch --prune $(GIT_REMOTE) >/dev/null; \
	echo "Files changed vs $(GIT_REMOTE)/$(GIT_MAIN):"; \
	git diff --name-status $(GIT_REMOTE)/$(GIT_MAIN)...HEAD || true
