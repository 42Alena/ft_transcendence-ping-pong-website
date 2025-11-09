import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import { authRequiredOptions } from './utils';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';
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



	// get public profile for special user/users/123  /users/124
	fastify.get<{ Params: API.GetUserParams }>(
		"/users/:userId",
		authRequiredOptions,
		async (req, reply) => {
			const { userId } = req.params;

			const user = await userManager.getUserById(userId);
			if (!user) {
				return sendError(reply, "User not found", "userId", 404);
			}

			return sendOK(reply, toUserPublic(user))
		});

/* 

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
 */

	// ______________FRIENDS: ADD: POST /friends/:id_____________


/* 	fastify.post<{ Params: API.TargetIdParams }>(
		"/friends/:id",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const {id: friendId} = req.params;  // friendId: string (UserId)

			if (!await userManager.existsById(friendId)) {
				return sendError(reply, "User not found", "id", 404);
			}

			await userManager.addFriend(meId, friendId);

			return sendNoContent(reply);
		}); */




	// ______________FRIENDS:    DELETE /friends/:id_____________
	// ______________BLOCKS: ADD :POST  /blocks/:id_____________
	// ______________BLOCKS:    DELETE /blocks/:id_____________

	//_________________SETTINGS: CHANGE AVATAR____________
	//_________________SETTINGS: CHANGE DISPLAY NAME____________
	//_________________SETTINGS: CHANGE PASSWORD NAME____________
	//_________________SETTINGS: DELETE USER____________
	
	
	//_________________ONLINE/OFFLINE____________

}
