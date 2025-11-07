import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import { authRequiredOptions } from './utils';
import { sendError, sendOK } from '../lib/utils/http';
import { toUserPublic, toUserSelf } from '../lib/mappers/user';
import type * as API from '../lib/types/api';

// import { User } from '../lib/Class/User';
// import { generateId } from '../lib/utils/generateId';

// type GetUserParams = { userId: Types.UserId };
/* 
/users (collection, public, read-only for now)

GET /users // list public profiles

GET /users/:id // one public profile by id
*/
export function registerUserRoutes(fastify: FastifyInstance, userManager: UserManager) {

	// GET /users → public list (displayName, avatarUrl, id)
	fastify.get("/users", authRequiredOptions, async (req, reply) => {

		const users = await userManager.getAllUsers();

		return sendOK(reply, users.map(toUserPublic));

	});


	//personal profile(username, displayName, avatarUrl, id)
	fastify.get("/users/me", authRequiredOptions, async (req, reply) => {

		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler
		if (!meId) return sendError(reply, "need cookies", "auth", 401);

		const me = await userManager.getUserById(meId);
		if (!me) return sendError(reply, "User not found", "userId", 404);

		return sendOK(reply, toUserSelf(me));
		});





// /users/123
// /users/124
fastify.get<{ Params: API.GetUserParams }>(
	"/users/:userId",
	authRequiredOptions,
	async (request, reply) => {
		const { userId } = request.params;

		const user = await userManager.getUserById(userId);
		if (!user) {
			return sendError(reply, "User not found", "userId", 404);
		}

		return sendOK(reply, toUserPublic(user))
	});



	//____________________/ME: FRIENDS_______________________
	
	//all who are my my friends
	fastify.get("/users/me/friends", authRequiredOptions, async (req, reply) => {
		
		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler
	
		
		const myFriends = await userManager.getMyFriends(meId); // returns Domain.User[]
		

		return sendOK(reply, myFriends.map(toUserPublic));
	});
	
	//____________________/ME: BLOKS_______________________

	//all who I blocked
	fastify.get("/users/me/blocks", authRequiredOptions, async (req, reply) => {
		
		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler
	
		
		const myBlocks = await userManager.getMyBlocks(meId); // returns Domain.User[]
		

		return sendOK(reply, myBlocks.map(toUserPublic));
	});


}
