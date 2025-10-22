import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import type *  as Types from '../lib/types/types';
import type { UserId } from '../lib/types/types';

// import { User } from '../lib/Class/User';
// import { generateId } from '../lib/utils/generateId';

type GetUserParams = { userId: Types.UserId };
/* 
/users (collection, public, read-only for now)

GET /users // list public profiles

GET /users/:id // one public profile by id
*/
export function registerUserRoutes(fastify: FastifyInstance, userManager: UserManager) {

	fastify.get("/users", async () => {
		//for test created user
		// const usr1 = new User('usr' + Math.random(), generateId())
		// await userManager.saveUser(usr1)
		//end test created user

		const users = await userManager.getAllUsers();
		// return users.map((user) => user.profile());
	})

	fastify.get<{ Params: GetUserParams }>(
		"/users/:userId",
		async (request, reply) => {
			const { userId } = request.params;   //params: validates the params(https://fastify.dev/docs/latest/Reference/Routes/)
			// const id = (request.params as any).userId;
			const user = await userManager.getUserById(userId);
			if (!user) {
				return reply.code(404).send({ error: "User not found" });
			}
			// return user.profile();
		})

	fastify.get

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
	   // generate acces token
	   // save acccess token  : set expiry = add Date.now() + 7d
	   // return access token
	   // res.header('set-cookie', 'auth=accessToken')
	})

	fastify.post("/users/register", async (req) => {
	   // GOAL: create user record in users db table

	   // validate username/passow/avatar
	   // pass -> encryptPassword (bcrypt / sha512) -> passwordHash
	   // save in db

	   // OPTIONAL goal: create access token right away and return it
	   // return access token optional
	   // 
	})

how frontend will work with access tokens:
//1 header
/// frontend will have to store access token somehwere.. sessionStorage/localStorage/indexedDb
fetch('/users/me', {
  headers: {
	Authorization: `Bearer: ${accessToken}`
  }
})
//2 cookies
fetch('/users/me'); // browser will attach cookie automatically


	// auth flow for user-only resource
	fastify.post("/only/secure/123", async (req, res) => {
	  // 1. get access token from req
	  //   req.headers('Authorization')  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization
	  //   req.cookies() ///  same header  https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies 
	  // 2 if no token - 401 (auth required)
	  // 3 if token -> validate token
	  // 3.1 - check access token db if this token is present
	  // 3.2 -> no token -> 401 (auth required)
	  // 3.3 -> token exists and not expired -> return user_id
	  // (optional) 4. if token.user_id !== 123 -> 403 access denied

	  // business as usual: token.user_id -> authenticated user
	});

	async function getUserFromRequest(req): Promise<User> {
	 // 1. get authentication header
	 // 2. get cookie ("auth")
	 // check db if token is present
	 // userManager.getById(token.user_id)
	 // return User()
	 // if no user -> throw Error()
	}
	
	*/

	// fastify.post("/user", async (req, res) => {
	// 	console.log('Register user', req.body)

	// 	const { name, avatarUrl } = req.body as any;


	// 	try {
	// 		const newUser = new User(name, generateId())

	// 		await userManager.saveUser(newUser)
	// 		return newUser.profile();
	// 	} catch (e: any) {
	// 		return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
	// 	}
	// });

	// const handler = async () => {};
	// fastify.get('/path', handler)

	//register handler


	//TODO: create user id


	/*   FOR LATER
	fastify.post("/user/register", async (req, res) => {
		console.log('Register user', req.body)

		const { name, avatarUrl } = req.body as any;


		try {
			const newUser = new User(name, generateId())

			await userManager.saveUser(newUser)
			return newUser.profile();
		} catch (e: any) {
			return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
		}
	}
	*/
}
