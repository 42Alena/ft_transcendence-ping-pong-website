import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import type *  as Types from '../lib/types/api';
import { User } from '../lib/services/User';
import { generateId, generateSessionToken } from '../lib/utils/randomId';
import { hashPassword, verifyPassword } from '../lib/utils/password';
import * as Validate from '../lib/utils/validators';


//sendOK(res, user.toPublicProfile(), 201); for non 200
export function sendOK<T>(res: FastifyReply, payload: T, statusCode = 200) {
	return res.status(statusCode).send(payload);
}

export function sendError(
	res: FastifyReply,
	error: string,
	field: string,
	statusCode = 400): FastifyReply {
	// { [field]: error }
	return res.status(statusCode).send({ error, field })
}

export async function authCheck(
	req: FastifyRequest,
	res: FastifyReply,
	userManager: UserManager
): Promise<FastifyReply> {
	const loginSessionId = (req as Types.UserAwareRequest).loginSessionId;

	if (!loginSessionId) {
		return sendError(res, "not valid session", "auth", 401);
	}

	if (! await userManager.isLoginSessionExist(loginSessionId)) {
		return sendError(res, "session not exist", "auth", 401)
	}

	return res.send("authCheck: OK")

}

/* 
	/*  "/user/register" 
	GOAL: create user record in users db table

	   validate username/passow/avatar
	   pass -> encryptPassword (bcrypt / sha512) -> passwordHash
	   save in db

	   OPTIONAL goal: create access token right away and return it
	   return access token optional
	fastify.get('/res', handler)
	dont trimm passwordPlain(can have empty chars)

	*/
export function registerAuthRoutes(fastify: FastifyInstance, userManager: UserManager) {





	/* 

registration
login. After will return generated secret session acces token/string
online/offline /not in db./ laschange after last activity (beacon each 1m for backend)
update profile/ change pass(check subject)  put method
add to db  one table for access token. userId, expireDate/valid(if experid, hten delete it), expireToken . Each time after login must be NEW acess token.(Logout must delete this access token)

*/
	fastify.post("/user/register", async (req, res: FastifyReply) => {
		console.log('Register user', req.body)
		const body = req.body as Types.RegisterBody;
		// const { username, displayName, passwordPlain, avatarUrl } = req.body as Types.RegisterBody;

		const username = Validate.normalizeName(body.username)
		const displayName = Validate.normalizeName(body.displayName)
		const passwordPlain = body.passwordPlain;
		const avatarUrl = Validate.normalizeString(body.avatarUrl)

		//username
		if (!username) { return sendError(res, "No user name", "userName") }
		const validateUsernameError = Validate.validateName(username);
		if (validateUsernameError) { return sendError(res, validateUsernameError, "userame") }

		//display name
		if (!displayName) { return sendError(res, "No display name", "displayName") }
		const validateDisplayNameError = Validate.validateName(displayName);
		if (validateDisplayNameError) { return sendError(res, validateDisplayNameError, "displayName") }
		if (await userManager.isDisplayNameTaken(displayName)) { return sendError(res, "Display name is taken", "displayName") }

		//passwordPlain
		if (!passwordPlain) { return sendError(res, "No password", "passwordPlain") }
		const validatePassError = Validate.validatePassword(passwordPlain, username, displayName)
		if (validatePassError) { return sendError(res, validatePassError, "passwordPlain") }


		// check uniq displayname
		try {

			const newUser = new User({
				id: generateId(),
				username,
				displayName,
				passwordHash: await hashPassword(passwordPlain),
				avatarUrl: avatarUrl ? avatarUrl : null,
				lastSeenAt: null,
			})
			console.debug("Saving new user", newUser)
			await userManager.saveUser(newUser)
			res.header('set-cookie', `usr=${newUser.id}`);

			return sendOK(res, newUser.toPublicProfile(), 201); // 201 Created
		} catch (e: any) {
			return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
		}

	});



	/*  can use cookies to store access tokens:
	 https://fastify.dev/docs/latest/Reference/Reply/#getheaderkey 
	
	   check usernmae and rawPassword
			  check if user with (username, encryptPssword(rawPassword))
	   save acccess token  : set expiry = add Date.now() + 7d
	   return access token
	   res.header('set-cookie', 'auth=accessToken') */
	fastify.post("/user/login", async (req, res: FastifyReply) => {
		console.log('Login user', req.body)
		const body = req.body as Types.LoginBody;
		// const { username, displayName, passwordPlain, avatarUrl } = req.body as Types.LoginBody;

		const username = Validate.normalizeName(body.username)
		const passwordPlain = body.passwordPlain;


		if (!username) { return sendError(res, "No user name", "userName") }
		if (!passwordPlain) { return sendError(res, "No password", "passwordPlain") }



		const user = await userManager.getUserByUsername(username);

		if (!user) { return sendError(res, "No user", "username", 401) }

		if (!verifyPassword(passwordPlain, user.passwordHash)) { return sendError(res, "incorrect password", "passwordPlain", 401) }

		const loginSessionId = generateSessionToken();

		await userManager.saveLoginSession(loginSessionId, user.id);


		res.header('set-cookie', `auth=${loginSessionId}`); //`backtig is a literal string to put value

		// sends user.toPublicProfile() JSON with HTTP 201(user created)
		return sendOK(res, user.toPublicProfile(), 201)
	});


	//204 No Content
	fastify.post("/user/logout", async (req, res: FastifyReply) => {

		const loginSessionId = (req as Types.UserAwareRequest).loginSessionId;
		// if (!req.userId) {
		// 	return res.send(401)
		// }

		console.log(loginSessionId);
		return res.send(200);

		// console.log('Logout user', req.body)
		// const body = req.body as Types.LoginBody;
		// try {
		// 	authCheck(req, res, userManager)

		// 	return sendOK(res, "user logout");
		// } catch (e: any) {

		// 	return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already logout"}%   
		// }

		// await userManager.deleteLoginSession(loginSessionId, userId)
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