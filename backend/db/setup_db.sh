#!/bin/bash

set -ex

SCRIPT_DIR=$(dirname "$0")
DB_DIR="$SCRIPT_DIR"/../db
DB_PATH="$DB_DIR/pong.db"

echo "Initializing database at $DB_PATH"

# create database directory if it doesn't exist
mkdir -p "$DB_DIR"

# check if SQLite is installed
if ! command -v sqlite3 &> /dev/null; then
    echo "SQLite is not installed. Please install SQLite to proceed."
    exit 1
fi

# initialize the database
if [ ! -f "$DB_PATH" ]; then
    echo "Creating new database..."
    sqlite3 "$DB_PATH" < "$DB_DIR/current_init_db.sql"
<<<<<<< HEAD
    # sqlite3 "$DB_PATH" < "$DB_DIR/create_schema.sql"
=======
>>>>>>> main
else
    echo "Database already exists. Skipping creation."
fi

echo "Database initialized at $DB_PATH"
echo "You can start the server now."
