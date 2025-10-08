
for pullrequests:
TODO:



DONE:
## Backend

	- moved DB code to backend/ from backend/src/
	- backend/.dockerignore added: ignore db/*.db*, node_modules, logs
	- add knex to work with DB (is allowed: https://knexjs.org/guide/query-builder.html#where)

## Frontend
	-add Dockerfile
	-add .dockerignore

### dockercompose
 -add db
 -add frontend

## ALL:
### Makefile 
	- updated: added db target and wired it into setup
	- add Docker Compose commands
	- `make setup` now installs deps and initializes SQLite

### .gitignore
	 - updated: ignore backend/db/*.db*
 	- (no SQLite binaries in Git)
	- (smaller/faster Docker build context)
_________________
- created new main .md file with new module choosed(instead 2FA)
- backend/routes/chat.ts 
	- to test with curl/brouser
- backend/routes/user.ts for http requests from frontend
-backend/src/main

[]Must create new user with unique name (or error if duplicate).
[]profile

[] UserManager: addFriend
[] UserManager: removeFriend