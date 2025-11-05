import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import type *  as Types from '../lib/types/domain';
import type { UserId } from '../lib/types/domain';
import { authRequiredOptions } from './utils';
import { sendOK } from '../lib/utils/http';
// import { User } from '../lib/Class/User';
// import { generateId } from '../lib/utils/generateId';

// type GetUserParams = { userId: Types.UserId };
/* 
/users (collection, public, read-only for now)

GET /users // list public profiles

GET /users/:id // one public profile by id
*/
export function registerUserRoutes(fastify: FastifyInstance, userManager: UserManager) {

	fastify.get("/users", authRequiredOptions, async () => {

		const users = await userManager.getAllUsers();
		return users.map((user) => user.toPublicProfile());
	})

	fastify.get('/users/me', ...)

	// /users/123
	// /users/124
	fastify.get<{ Params: GetUserParams }>(
		"/users/:userId",
		authRequiredOptions,
		async (request, reply) => {
			const { userId } = request.params;   //params: validates the params(https://fastify.dev/docs/latest/Reference/Routes/)
			// const id = (request.params as any).userId;
			const user = await userManager.getUserById(userId);
			if (!user) {
				return reply.code(404).send({ error: "User not found" });
			}

			return sendOK(reply, user.toPublicProfile(), 201)
		})




	// fastify.post("/users/logout", authRequiredOptions, async (req, res: FastifyReply) => {

	// 	const loginSessionId = (req as Types.UserAwareRequest).loginSessionId;
	// 	const userId = (req as Types.UserAwareRequest).userId;

	// 	console.log(loginSessionId, userId);


	// 	try {

	// 		await userManager.deleteLoginSession(loginSessionId, userId)
	// 		res.header('set-cookie', "auth="); //`backtig is a literal string to put value
	// 		return sendOK(res, null, 204); //204 No Content
	// 	} catch (e: any) {

	// 		return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already logout"}%   
	// 	}

	// });

}

/*

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

