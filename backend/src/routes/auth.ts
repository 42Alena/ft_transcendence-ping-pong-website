
import type { FastifyInstance, FastifyReply } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import type *  as API from '../lib/types/api';
import * as Validate from '../lib/utils/validators';
import { generateId, generateSessionToken } from '../lib/utils/randomId';
import { hashPassword, verifyPassword } from '../lib/utils/password';
import { authRequiredOptions } from './utils';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';
import { toUserSelf } from '../lib/mappers/user';




export function registerAuthRoutes(fastify: FastifyInstance, userManager: UserManager) {


	/* 

registration
login. After will return generated secret session acces token/string
online/offline /not in db./ laschange after last activity (beacon each 1m for backend)
update profile/ change pass(check subject)  put method
add to db  one table for access token. userId, expireDate/valid(if experid, hten delete it), expireToken . Each time after login must be NEW acess token.(Logout must delete this access token)

*/
	fastify.post("/auth/register", async (req, reply: FastifyReply) => {
		console.log('Register user', req.body)
		const body = req.body as API.RegisterBody;
		// const { username, displayName, passwordPlain, avatarUrl } = req.body as API.RegisterBody;

		const username = Validate.normalizeName(body.username)
		const displayName = Validate.normalizeName(body.displayName)
		const passwordPlain = body.passwordPlain;
		const avatarUrl = Validate.normalizeString(body.avatarUrl)

		//username
		if (!username) { return sendError(reply, "No user name", "username") }
		const validateUsernameError = Validate.validateName(username);
		if (validateUsernameError) { return sendError(reply, validateUsernameError, "username") }

		//display name
		if (!displayName) { return sendError(reply, "No display name", "displayName") }
		const validateDisplayNameError = Validate.validateName(displayName);
		if (validateDisplayNameError) { return sendError(reply, validateDisplayNameError, "displayName") }
		if (await userManager.isDisplayNameTaken(displayName)) { return sendError(reply, "Display name is taken", "displayName") }

		//passwordPlain
		if (!passwordPlain) { return sendError(reply, "No password", "passwordPlain") }
		const validatePassError = Validate.validatePassword(passwordPlain, username, displayName)
		if (validatePassError) { return sendError(reply, validatePassError, "passwordPlain") }


		try {

			const newUser = await userManager.registerUser({
				username,
				displayName,
				passwordPlain,
				avatarUrl: avatarUrl ? avatarUrl : null,
			})
			console.debug("Saving new user", newUser) //TODO: comment out, for tests now

			reply.header('set-cookie', `usr=${newUser.id}`);

			return sendOK(reply, toUserSelf(newUser), 201); // 201 Created
		} catch (e: any) {
			return reply.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
		}

	});



	/*  can use cookies to store access tokens:
	 https://fastify.dev/docs/latest/Reference/Reply/#getheaderkey 
	
	   check usernmae and rawPassword
			  check if user with (username, encryptPssword(rawPassword))
	   save acccess token  : set expiry = add Date.now() + 7d //TODO: change from DAte to number as in DB
	   return access token
	   reply.header('set-cookie', 'auth=accessToken') */
	fastify.post("/auth/login", async (req, reply: FastifyReply) => {
		console.log('Login user', req.body)
		const body = req.body as API.LoginBody;
		// const { username, displayName, passwordPlain, avatarUrl } = req.body as API.LoginBody;

		const username = Validate.normalizeName(body.username)
		const passwordPlain = body.passwordPlain;

		if (!username) { return sendError(reply, "No user name", "username") }
		if (!passwordPlain) { return sendError(reply, "No password", "passwordPlain") }

		const user = await userManager.getUserByUsername(username);

		if (!user) { return sendError(reply, "No user", "username", 401) }

		if (! (await verifyPassword(passwordPlain, user.passwordHash))) { return sendError(reply, "incorrect password", "passwordPlain", 401) }

		const loginSessionId = generateSessionToken();

		await userManager.saveLoginSession(loginSessionId, user.id);


		reply.header('set-cookie', `auth=${loginSessionId}; Path=/;  HttpOnly;`); //`backtig is a literal string to put value


		return sendOK(reply, toUserSelf(user))
	});




	fastify.post("/auth/logout", authRequiredOptions, async (req, reply: FastifyReply) => {

		const loginSessionId = (req as API.UserAwareRequest).loginSessionId;
		const userId = (req as API.UserAwareRequest).userId;

		// console.log(loginSessionId, userId);


		try {

			await userManager.deleteLoginSession(loginSessionId, userId)
			reply.header('set-cookie', "auth="); //`backtig is a literal string to put value
			return sendNoContent(reply);
		} catch (e: any) {

			return reply.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already logout"}%   
		}

	});
}


/* 

	fastify.get('/auth/playground', async (req, res) => {
		res.header('content-type', 'text/html')
			.send(`
<html>
<body>
<h1>User register test</h1>
<form action="/user/register" method="POST">
<input type="text" name="username" placeholder="username" />
<input type="text" name="displayName" placeholder="displayName" />
<input type="text" name="avatarUrl" placeholder="avatarUrl" />
<input type="password" name="passwordPlain" placeholder="password" />
<button>Save</button>
</form>
<script>
// document.getElementById('...')
</script>
</body>
</html>`)
	})

*/