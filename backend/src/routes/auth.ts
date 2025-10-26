import type { FastifyInstance, FastifyReply } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import type *  as Types from '../lib/types/api';
import { User } from '../lib/services/User';
import { generateId } from '../lib/utils/randomId';
import { hashPassword } from '../lib/utils/password';
import * as Validate from '../lib/utils/validators';


	/* 
	TODO:
	registration
	login. After will return generated secret session acces token/string
	online/offline /not in db./ laschange after last activity (beacon each 1m for backend)
	update profile/ change pass(check subject)  put method
	add to db  one table for access token. userId, expireDate/valid(if experid, hten delete it), expireToken . Each time after login must be NEW acess token.(Logout must delete this access token)

	// can use cookies to store access tokens:
	// https://fastify.dev/docs/latest/Reference/Reply/#getheaderkey 


	fastify.post("/login", async (req) => {
	   // check usernmae and rawPassword
			  // check if user with (username, encryptPssword(rawPassword))
	   // save acccess token  : set expiry = add Date.now() + 7d
	   // return access token
	   // res.header('set-cookie', 'auth=accessToken')
	})
*/
export function registerAuthRoutes(fastify: FastifyInstance, userManager: UserManager) {


	const sendError = (res: FastifyReply, error: string, field: string) => {
		// { [field]: error }
		return res.status(400).send({ error, field })
	}


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
	fastify.post("/user/register", async (req, res: FastifyReply) => {
		console.log('Register user', req.body)
		const body = req.body as Types.RgisterBody;
		// const { username, displayName, passwordPlain, avatarUrl } = req.body as Types.RegisterBody;

		const username = Validate.normalizeString(body.username)
		const displayName = Validate.normalizeString(body.displayName)
		const passwordPlain = body.paswordPlain;
		const avatarUrl = Validate.normalizeString(body.avatarUrl)

		//username
		if (!username) { return sendError(res, "No user name", "userName") }
		if (Validate.validateName(username)) { return sendError(res, "Display name is taken", "userame") }

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
			return newUser.toPublicProfile();
		} catch (e: any) {
			return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
		}
	});
}
