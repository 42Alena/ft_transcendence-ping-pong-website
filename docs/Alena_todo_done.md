
# TEMPLATE FOR PULLREQUESTS

# IDEAS:TODO:

## ALL:
## DB
## README
## Backend
## Frontend  make frontend
### dockercompose
### Makefile 
### .gitignore
DONE:
_________________________________________
for pullrequests:
TODO:
make rebuild db after db change
make db save in separate file, then easier rebuild after change
add to .sh remove and adddb(recreate)
make autofill db from .csv to db for tests

In progress:




DONE:
## Links helpfull:
	https://knexjs.org/guide/query-builder.html#knex
## DB
		- add autofill db for test test_fill_users_dev.sql (tmp, fill users, need for dev)

## README
## Backend
	added CORS to fastify :
			 npm i @fastify/cors --save
			https://github.com/fastify/fastify-cors

	- add routes/healthz = fast check that backend alive  
		curl -s http://localhost:3000/healthz
		# => {"ok":true}

	- add routes/auth 
		-GET /users = list public profiles

		- GET /users/:id = one public profile (404 if not found)
### User:
	- add simple conversion to Db and from DB

### UserManager:
	- connected getAllUsers() with db

### user.ts
	- GET /users // list public profiles
	- GET /users/:id // one public profile by id
	
## Frontend

### Makefile 
		- TO work with DB:
			db-fill db-wipe-users db-show-users db-count

### TESTS
		I added also function, that fill db: test_fill_db_dev.sql
		1.terminal: make backend
		2.teminal: make db-fill 
		2.terminal: curl -v http://localhost:3000/users

		//for test created user
		const usr1 = new User('usr' + Math.random(), generateId())
		await userManager.saveUser(usr1)
		//end test created user

_____test DB with knex:
for test user-db created in routes/users 1 user
<!-- 
	fastify.get("/users", async () => {
		//for test created user
		const usr1 = new User('usr' + Math.random(), generateId())
		await userManager.saveUser(usr1)
		//end test created user
 -->

then in console(brouser)run: 
loadAllUsers()
+check in network
________________end test


	terminal check for b.end: curl 'http://localhost:3000/users' 

	curl 'http://localhost:3000/users' 
	{"statusCode":500,"code":"SQLITE_CONSTRAINT","error":"Internal Server Error","message":"insert into `users` (`id`, `username`) values ('c63c2623bfe3b54b91fdb6a3', 'usr0.8609481313678393') - SQLITE_CONSTRAINT: NOT NULL constraint failed: users.passwordHash"}%  


## ADD TO ISSUE
 -  add to issue(for Sveva):
 ```bash
	//functions
	function startGame() : void {
		//(Alena): added next line to silent:src/script.ts:189:2 - error TS2322: Type 'Timeout' is not assignable to type 'number'
		
		//@ts-ignore
		intervalId = setInterval(draw, 20);
	```
}

	- review webpage for chat (schould be profil or all user as table?)




___________________
	- found current db fields that now needed and used by Classes
	-created for it db/current_init_db.sh
	-created for it docs/current_init_db.md
	-updated with current state
_______
	- moved DB code to backend/ from backend/src/
	- backend/.dockerignore added: ignore db/*.db*, node_modules, logs
	- add knex to work with DB (is allowed: https://knexjs.org/guide/query-builder.html#where)
	-
	-add Dockerfile
	-add .dockerignore
 -add db
 -add frontend
	- updated: added db target and wired it into setup
	- add Docker Compose commands
	- `make setup` now installs deps and initializes SQLite

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