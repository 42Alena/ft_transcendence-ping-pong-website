# Alena — Personal Work Log

Internal file for tracking what I’ve done in the project, with notes and links.  
Not required for evaluation — used for organization and pull request preparation.


---------------------
------------------------
### ======    NEW PULLREQUESTS   ================================================================
## DB

## BACKEND

## FRONTEND

### TESTS

## 📘 DOCUMENTATION

## 🔗 LINKS / HELP
--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------

-----------------------

##_____________  TODO FOR FUTURE:

- ROUTES/USer
	- add data validation (deleted from User constructor)

- Tournament:
	- unique alias(insttead displayname) for tournament only, not globally

- USER: 
	-lastSeenAt(change logic for  for online/ offline)
   [] make in authRequiredOptions and Usermanager(fkt) updating online in lastSeenAt
	-- Alena online/offline /not in db./ laschange after last activity, update each time last activity. Not active after 10min
	- add conversion for Time from number to Date, if needed


##FRONTEND:
 	- add tailwind to frontend

### ======    NEW PULLREQUESTS   ================================================================

## DB
	-user table; deleted 'last seen'
	-sessions: added created at + ping update

## BACKEND
	- added 2 types for own and other profile
	-deleted profile basic
	-changed types to send from backend to frontend: userPublic + userSelf
	-changed for login, logout, registration route from /user to /auth to avoid confusion with /user/..profiles

	- added GET /users/:id (public profile)

    -added GET /me   (own profile/settings)
	- created utils and moved there  moved sendOk(),sendErr() for all routes
	-created lib/mappers/user.ts and moved mappers to API from class
	-changed time from Date to number, because DB saved as number(no need conversion for now, will add conversion if needed) 
	-added types.db and moved there UserDbRow 

### Usermanager
	+ createUser()
	+ saveUserInDb() changed
## FRONTEND

### TESTS

## 📘 DOCUMENTATION

## 🔗 LINKS / HELP

--------------------------
### ======    OLD PULLREQUESTS   ================================================================================================================================
## DB
 - deleted roows with login expire. Not requiered
 - add timecreation stamp for login

## BACKEND
### USermanager:
 -isLoginSessionExist()
 -saveLoginSession()
 -deleteLoginSession()
 -getUserIdByLoginSession()

### auth.ts
	- "/user/login"
	- '/auth/check'
	- authCheck()
	- user/logout

### types/api.ts
	+  type UserAwareRequest 

### decorators.ts
	- adds custom fields to every request (userId, loginSessionId) via decorators

## FRONTEND

### TESTS
1.LOGIN TEST:
```bash
#  0. register:
 curl localhost:3000/user/register -X POST -H "Content-type: application/json" -d '{"username": "dcba2", "passwordPlain": "cbadsafsdfaer1Fferagraeg", "displayName": "admnasdf" }' -v 
#  2. check login
 curl localhost:3000/user/login -X POST -H "Content-type: application/json" -d '{"username": "dcba2", "passwordPlain": "cbadsafsdfaer1Fferagraeg"}' -v

 #3. check cookie auth
#  curl localhost:3000/auth/check  -H "Content-type: application/json" -H "cookie: auth=3f630bb5d981e3415728a7ec0681d35f9d2eb79384bb07f3d1f316ab2862b10d" -v 
 
 #4. logout. add decorators to extract auth cookie 9change cookie from terminal auth:
  curl localhost:3000/user/logout -X POST -v -H 'Cookie: auth=3f630bb5d981e3415728a7ec0681d35f9d2eb79384bb07f3d1f316ab2862b10d'


```
## 📘 DOCUMENTATION

## 🔗 LINKS / HELP
--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------

## DB
	-  added  username     case insencitive (COLLATE NOCASE)
	- added table for LOGIN session key
## BACKEND added:
	- types/api
	- register user
	- added backend/tests/users.sh ( history | grep curl | uniq)
	- validateName() validatePassword()
	-  POST /register
	- normalize name9 case insensitive, .normalize("NFKC")  // unify Unicode  chars
	
## FRONTEND
		- added types/api
		-index.html added "errror messagebox"

### TESTS
	-  run in terminal: ./backend/tests/users.sh

	- in terminal: curl localhost:3000/user/register -X POST -H "Content-type: application/json" -d '{"username": "dcba", "passwordPlain": "cbadsafsdfaer1Fferagraeg", "displayName": "admn" }' -v 

	- in console browser. copy ft register without types  and run: apiAuthRegister({
"username": "dcba", "passwordPlain": "cbadsafsdfaer1Fferagraeg", "displayName": "ardmn" }) 

## 📘 DOCUMENTATION
	- added /backend/tests/README.md
	- deleted module Stats(after todays team meeting)
	- HTTP_response_codes.md
	- docs/policies/policies_whole_project.md 
	- Profile Page requirements: docs/policies/profile.md 
## 🔗 LINKS / HELP

### 🌐 HTTP Basics
- [MDN – HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [MDN – HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)

### 📤 Request Methods
- [W3Schools – HTTP Methods](https://www.w3schools.com/tags/ref_httpmethods.asp)
- [IONOS – GET vs POST](https://www.ionos.de/digitalguide/websites/web-entwicklung/get-vs-post/)

### ⚠️ Error Messages & Status Codes
- [W3Schools – HTTP Messages](https://www.w3schools.com/tags/ref_httpmessages.asp)
- [MDN – HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)


--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------

# ____ DONE:

## DB
	- updated table user for curent User class
	- added tables for  friends, blocked
	- make autofill db from .csv to db for tests

## NPM
	- added bcrypt for hash passwords: npm install --save bcryptjs
## README
		made changes in structure and corrected current status
## BACKEND
	- added bcrypt to crypto hash ID: https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
	- added functions for create and check hash password  with bcrypt
	-  ft session key encrypt

## PASSWORD
	- add crypto hash password https://nodejs.org/api/crypto.

### class User: 
		- declined DTO suggestion: using existing types/types.ts since the start of the project — in TypeScript you don’t need both types and interfaces
		- added displayName, according UserMng module
		- moved  from classe User  friends/blocks/match history in separate tables/services.
		- userStatus changed to lastSeenAt( will do later for online/ offline)
		- fix(user): align User fields with spec (displayName, wins/losses, lastSeenAt)
		-	updated costructor with current user fields
		-added userprofilePublic userProfileBasic 
		- class User is now working with Db (rewrote all functions)

### class UserManager: 
	- moved  from classe User  friends/blocks/match history in separate tables/services.
	- class UserManager is now working with Db (rewrote all functions)

### /DTO
	- declined /dto DTO suggestion: using existing types/types.ts since the start of the project — in TypeScript you don’t need both types and interfaces
	- /dto can be removed 



## FRONTEND 

### Makefile 
	make rebuild db after db change
	Command `make` to start whole project 

## LINKS/HELP: 
https://fastify.dev/docs/latest/Reference/Routes/
https://json-schema.org/overview/what-is-jsonschema
https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/
https://en.wikipedia.org/wiki/Query_string
https://json-schema.org/understanding-json-schema/about

## Tests:
https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
TRANSCENDENCE_public🕒12:16😸 node                                             
Welcome to Node.js v24.4.1.
Type ".help" for more information.
> const crypto = require('crypto')
undefined
> const pass = '123&%&%&asdasdf'
undefined
> const hasher = crypto.createHash('sha512')
undefined
> hasher.update(pass)
Hash {
  _options: undefined,
  Symbol(kHandle): Hash {},
  Symbol(kState): { Symbol(kFinalized): false }
}
> hasher.digest('hex')
> crypto.createHash('sha256').update("yarikk").digest('hex')
'b6dc72e1e2414ffc9c188c4876763aaa37a6a4351d00d3be2b2aff3915dc1268'
> 

### ======    OLD PULLREQUESTS   ================================================================

DONE:
## Links helpfull:
	https://knexjs.org/guide/query-builder.html#knex
## DB
		- add autofill db for test test_fill_users_dev.sql (tmp, fill users, need for dev)
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