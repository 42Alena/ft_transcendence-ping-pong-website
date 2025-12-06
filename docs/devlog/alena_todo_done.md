# Alena — Personal Work Log

Internal file for tracking what I’ve done in the project, with notes and links.  
Not required for evaluation — used for organization and pull request preparation.


---------------------
------------------------
### ======    NEW PULLREQUESTS   ================================================================
## DB

## BACKEND
### UserManager
### User_routes
### domain types

### api types
## FRONTEND

### TESTS

## 📘 DOCUMENTATION

## 🔗 LINKS / HELP

# HOW TO TEST: 
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_user_settings
```
 

--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------

-----------------------

##_____________  TODO FOR FUTURE:
- update each time last activity. Not active after 10min

	-lastSeenAt(change logic for  for online/ offline)
	- add conversion for Time from number to Date, if needed
	-statistic
	-gamemanager ; save Game and tournament

------------------------
### ======    NEW PULLREQUESTS   ================================================================
## DB
	-updated table for game, to save as winner and loser, simplified logic

## BACKEND
### UserManager
### User_routes
### domain types
	+ added types for game and tournament

### api types
	 + added API types for games


### db.ts
  - added types for db.ts for  GamesDbRow 

## FRONTEND

### TESTS

## 📘 DOCUMENTATION

## 🔗 LINKS / HELP

# HOW TO TEST: 
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_user_settings
```
 

--------------------------
### ======    OLD PULLREQUESTS   ================================================================


## DB for chat:
	- PublicMessage
	+ TournamentMessage

## BACKEND
	+ backend/src/lib/mappers/chat_db.ts
	+ backend/src/lib/types/db.ts
	+ added ChatDBRow in backend/src/lib/types/db.ts
	+aded to reserved names 'SYSTEM_ID', 'ai'

### CHat
	- removed old in-memory chatMessages array
	+ add Chat constructor with UserManager + messages table factory
	+ saveMessageInDB()
	+ added message validation with validateMessageContent 
	- checkPrivateSender 
	- checkPrivateReceiver
	+ sendPrivateMessage()
	+ sendUserToUserMessage()
	+ sendPrivateGameInviteMessage()
	+ sendTournamentMessage()
	+ adapted send new messages with different types of NewMessageChat
	+ corrected sendTournamentMessage to work withoit ender(system_id)
	+ addeddd isCommmunicationBlocked for  both sides
	+  getChatCoversationSideBar, working with DB

### UserManager
	+ added additional check for get users/id if not deleted
### User_routes
### domain types
	- corrected types for messages, excuded public msg. will be no public chat 
	+ sendMessageResult
	+ TOURNAMENT_AI_ALIASES:
		 - 5  reserved names for AI:
		- 'AI',
		- 'AI_AlENA',
		- 'AI_SVEVA',
		- 'AI_LUIS',
		-'AI_42BERLIN',
	+ added different type of meta for messages in Chat tournament/invite
	+ added different types to messages with/without meta:
	```
		NewMessageChat =
	| NewPrivateMessage
	| NewGameInviteMessage
	| NewTournamentMessage;
	```

	+ ChatSidebarItem
	+ MessageDbRowSenderReceiver 

### user_db.ts
	- UserSidebarDbRow 
	


### api types
	+ all types for chat sending messages
	+ ChatConversationSidebar

#### validators 
	+ validateMessageContent
	+ added
	+ add check if name starts with AI_ or is 5  reserved names for AI'

### TESTS
	+ backend/tests/chat.sh  - tests for chat


# HOW TO TEST: 
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_chat
```



	
### ======    NEW PULLREQUESTS   ================================================================

## DB

1. deleted old tables, that not rensponse current state:
	- tournaments ( ... );

	- tournamentPlayers ( ... );

	- tournamentMatches ( ... );

	- userStatistics 

	- gdpr

2. created single table "games" for all games and tournaments together
```bash
# -- One row = one finished game.
# -- mode:
# --   'game'       -> normal 1v1 game
# --   'tournament' -> tournament semi / final
# -- 
# --   winner:
# --       1 -> player1 won
# --       2 -> player2 won

# --   round:
# --       NULL          -> normal game
# --       'semi'        -> tournament semi-final
# --       'final'       -> tournament final

# --    users are "deleted" by soft delete (deletedAt + anonymized name),
# --     so we normally never DELETE from users. Old games remain valid for stats.
```




--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------


## FRONTEND
 - added chart.js package (small library to draw graphs (used for Stats Dashboard))
 - fixed tsconfig.json module resolution (so TypeScript can find Chart.js correctly)
 - installed esbuild bundler to bundle modules (inline libraries). Bundles TS + Chart.js into one browser-ready file
 - added script to  compile tailwind
 - changed makefile `make frontend` that now is doing all this steps.  now runs all steps (TS → JS, bundling, Tailwind)
 - added charts.ts


 - you  can see charts on the main page on the bottom, if you put test example from TEST in index.html


### TESTS

!must be canvas element

copy to index.html:
```bash
# index.html
    # <script src="dist/createRules.js"></script> line before

    <!-- ALENA -->
    <canvas id="myChart"></canvas>
    <script src="dist/charts.js"></script>
    <!-- ALENA -->

    # <script src="dist/api/user.js" type="module"></script> line after
```


## 🔗 LINKS / HELP

example from

 https://www.chartjs.org/docs/latest/getting-started/usage.html

# HOW TO TEST: 
1. copy example from TEST to index.html
```bash
	#  1. in 1.terminal 
	make frontend

```


--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------
This PR adds online/offline status for logged-in users.
Only authenticated users can check status, and only for themselves or their friends.
Non-friends cannot see your status.
After some time of no activity, the user is shown as offline.

## BACKEND
	+ config.ts: ONLINE_TIMEOUT_SEC for online time duration

### UserManager
	+ touchLastSeenAt()
	+ getUserOnlineStatus

### User_routes
	+ UserStatus
	+ UserStatusResult

### domain types
	+ UserStatus
	+ UserStatusResult


### TESTS
	+ tests for online/offline in user-settings.ts



# HOW TO TEST: 
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_user_settings
```


--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------
## DB
	+ updated lastseenAt, 0 = never seen, >0 = last activity time
	+ updated deletedAt, -- 0 = active, >0 = GDPR deletion time
	- commented out for Luis GDPR table, while do not needed(already have  deletedAt in table users)

## BACKEND
	+ utils/time.ts
	+ unixTimeNow()
	+ repaired warning for default values in DB.ts
### User Class
	+ deletedAt  for gdpr

### UserManager Class	
	+updatedregisterUser with deletedAt

### User_routes
### domain types
	+ for GDPR:
	+ DeleteAccountResult
	+ DELETED_USER_DISPLAY_NAME
	+ DELETED_USERNAME
	+ DELETED_AVATARURL 
	+ added to type user "deletedAt" 

### TESTS
	+ tests for delete account, gdpr

# HOW TO TEST: 
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_user_settings
```

--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------

## BACKEND
	+ created start point for avatar path: backend/src/config.ts 
	+ UPLOAD_DIR 

### UserManager
	+ changeAvatar()

### User_routes
	+ to change avatar: "/users/me/avatar"

### domain types
	+ ChangeAvatarResult

### TESTS
	- commented out other tests
	+ add test to check avatar

## 🔗 LINKS / HELP

# HOW TO TEST: 
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_user_settings
```


--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------

## BACKEND
	npm i @fastify/multipart --save
	https://github.com/fastify/fastify-multipart
### UserManager
	+ changeDisplayName()
	+ changePassword()

### User_routes
	+ To change Display Name: /users/me/display-name
	+ To change Password: /users/me/change-password"

### domain types
	+ ChangeDomainNameResult
	+ ChangePasswordResult

### api types
	+ ChangePasswordBody

## FRONTEND

### TESTS
	+ backend/tests/user-settings.sh (to test changing: displayname, avatar. to test delete account)

### Makefile
	+ tests_user_settings

## 📘 DOCUMENTATION

## 🔗 LINKS / HELP
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH 

# HOW TO TEST:
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make tests_user_settings
```



--------------------------
### ======    OLD PULLREQUESTS   ================================================================================================================================
## DB

## BACKEND
	+ types for add/delete friends
	+ types for block/unblock
	+ isBlockedByMeOrByOther()
	-/+  addFriend() added more checks, added more return types
	+ /friends/:id"  Route to add friend

### UserManager
	+ removeFriend()
	+/- updated blockUser() with type and check
	+/- updated unblockUser() with type and check

### /user routes
	+ delete /friends/:id  => delete friend
	+ /blocks/:id"   => block user

### Makefile
	+ helpful git commands: to update main branch/ to update banch(update main and then branch)/git stats
	+/- updated `db`
	+ change path for db for absolute
	+  `tests` 

## FRONTEND
 	+  settings to tsconfig.json file:
	```bash  
    //New settings for frontend (interval = setInterval(draw, 20);)
    // These settings make the frontend TypeScript compiler use browser (DOM) APIs, so setInterval is typed as a number (the actual browser handle). 
    // Setting "types": [] disables auto-including ambient @types/* (like Node), preventing accidental NodeJS.Timeout mismatches.

    "lib": ["ES2020", "DOM"],
    "types": []
	```



# HOW TO TEST:
```bash
	#  1. in 1.terminal 
	make backend

	# 2. in 2.terminal: 
	make backend-tests
```


--------------------------
### ======    OLD PULLREQUESTS   ================================================================
---------------------------------
## DB
	-user table; deleted 'last seen'
	-sessions: added created at + ping update
 	-deleted for login expired/ping
	+ added for blcoks "who i blocked index"
	- deleted index for friends and blocks, that already in primary key

## BACKEND
	- added 2 types for own and other profile
	-deleted profile basic
	-changed types to send from backend to frontend: userPublic + userSelf
	-changed for login, logout, registration route from /user to /auth to avoid confusion with /user/..profiles

	- added GET /users/:id (public profile)

    -added GET /me   (own profile/settings)
	- created utils/https.ts and moved there  moved sendOk(),sendErr() for all routes
	-created lib/mappers/user.ts and moved mappers to API from class
	-changed time from Date to number, because DB saved as number(no need conversion for now, will add conversion if needed) 
	-added types.db and moved there UserDbRow 
	-corrected auth cookie visability in another routes
	+ corrected logic in hook prehandler
	+ created /users/me/friends
	+ created /users/me/blocks


### Usermanager
	+ createUser()
	+ saveUserInDb() changed
	+ existsById()
	+ getUserByUsername()
	+getMyFriends()

## FRONTEND

### .gitignore
    - untracked folder for tests.tmp and added it in gitignore

### TESTS
	+ created tests in backend/tests/users.sh   (to run in terminal)
	+ to run tests in terminal
	```bash
	 make backend
	 backend/tests/users.sh
```

## 📘 DOCUMENTATION
| jq  => formats JSON nicely; without it you’ll see one long line.


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
 curl localhost:3000/auth/register -X POST -H "Content-type: application/json" -d '{"username": "hello", "passwordPlain": "cbadsafsdfaer1Fferagraeg", "displayName": "admnasdf" }' -v 

#  2. check login
 curl localhost:3000/auth/login -X POST -H "Content-type: application/json" -d '{"username": "hello", "passwordPlain": "cbadsafsdfaer1Fferagraeg"}' -v

 #3. check cookie auth
#   curl localhost:3000/auth/check  -H "Content-type: application/json" -H "cookie: auth=3f630bb5d981e3415728a7ec0681d35f9d2eb79384bb07f3d1f316ab2862b10d" -v 
 
 #4. logout. add decorators to extract auth cookie 9change cookie from terminal auth:
  curl localhost:3000/auth/logout -X POST -v -H 'Cookie: auth=3f630bb5d981e3415728a7ec0681d35f9d2eb79384bb07f3d1f316ab2862b10d'


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