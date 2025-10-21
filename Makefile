.PHONY: all setup check-tools frontend backend db backend-tests \
        up down logs reset-db ps rebuild-backend db-tables db-ping\
		 db-fill db-wipe-users db-show-users db-count
SHELL := /bin/bash

FRONTEND_DIR := frontend
BACKEND_DIR  := backend
DB_DIR       := backend/db
DB_FILL 	 := $(DB_DIR)/test_fill_users_dev.sql
DB         	 := $(DB_DIR)/pong.db
DC           := docker compose

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
	cd "$(FRONTEND_DIR)" && npm run compile && npm run serve

db: check-tools
	@rm $(DB_DIR)/pong.db*
	@chmod +x "$(DB_DIR)/setup_db.sh"
	cd "$(DB_DIR)" && ./setup_db.sh

backend-tests:
	cd "$(BACKEND_DIR)" && npm run backend-tests

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
	@sqlite3 -header -csv "$(DB)" "SELECT id,username,userStatus,isDeleted FROM users LIMIT 10;"

db-count:
	@sqlite3 "$(DB)" "SELECT COUNT(*) AS users FROM users;"

# === end Database: quick dev/test commands ===