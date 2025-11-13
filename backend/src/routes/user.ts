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


	// ______________FRIENDS: ADD: POST /friends/:id_____________

	//add friend
	fastify.post<{ Params: API.TargetIdParams }>(
		"/friends/:id",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { id: targetId } = req.params;  // targetId : string (UserId)

			const result = await userManager.addFriend(meId, targetId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "self") return sendError(reply, "Cannot add yourself", "id", 400);
			if (result.reason === "not_found") return sendError(reply, "User not found", "id", 404);
			if (result.reason === "blocked") return sendError(reply, "Blocked relationship", "blocked", 403);


		});




	// ______________FRIENDS:    DELETE /friends/:id_____________

	// delete friend
	fastify.delete<{ Params: API.TargetIdParams }>(
		"/friends/:id",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { id: targetId } = req.params;  // targetId : string (UserId)

			const result = await userManager.removeFriend(meId, targetId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "self") return sendError(reply, "Cannot remove yourself", "id", 400);

		});


	// ______________BLOCKS: ADD :POST  /blocks/:id_____________

	//block user
	fastify.post<{ Params: API.TargetIdParams }>(
		"/blocks/:id",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { id: targetId } = req.params;  // targetId : string (UserId)

			const result = await userManager.blockUser(meId, targetId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "self") return sendError(reply, "Cannot block yourself", "id", 400);

		});


	// ______________BLOCKS:    DELETE /blocks/:id_____________

	//unblock user
	fastify.delete<{ Params: API.TargetIdParams }>(
		"/blocks/:id",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { id: targetId } = req.params;  // targetId : string (UserId)

			const result = await userManager.unblockUser(meId, targetId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "self") return sendError(reply, "Cannot unblock yourself", "id", 400);

		});

	//_________________/ME/SETTINGS: CHANGE DISPLAY NAME____________

	/* Change displayname 
	Route: PATCH /users/me/display-name
	Auth: required (needs session cookie → userId)
	Body: { "displayName": "NewPublicName" }
	Checks:
	validate format (length, allowed chars)
	check if displayName is unique
	Uses in UserManager: changeDisplayName(userId, newDisplayName)
	// reason: "not_me" |  "taken_displayname" | "weak_displayname"};
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH */
	fastify.patch("/users/me/display-name", authRequiredOptions, async (req, reply) => {

		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler


		const { displayName: newDisplayName } = req.body as { displayName: API.DisplayName };
		console.log('Change display name', req.body)


		if (!newDisplayName) { return sendError(reply, "No display name", "displayName") }


		const result = await userManager.changeDisplayName(meId, newDisplayName);

		if (result.ok)
			return sendNoContent(reply);                  // 204

		// map domain reasons to HTTP
		if (result.reason === "not_me") return sendError(reply, "User not found", "id", 404);

		if (result.reason === "taken_displayname") return sendError(reply, "Displayname is taken", "displayname", 409);

		if (result.reason === "weak_displayname") {
			return sendError(reply,
				result.message ?? "Displayname is weak", // from validateName()
				"displayname",
				400);
		}

	});

	//_________________/ME/SETTINGS: CHANGE PASSWORD ____________
	/* 
	Change password
Route: PATCH /users/me/password
Auth: required
Body: { "currentPassword": "...", "newPassword": "..." }
Checks:
verify currentPassword against stored hash
validate newPassword (min length, etc.)
hash new password, save
optionally invalidate all other login sessions
Uses in UserManager: changePassword(userId, currentPassword, newPassword)
	
	*/
	fastify.patch("/users/me/change-password", authRequiredOptions, async (req, reply) => {

		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler


		const { displayName: newDisplayName } = req.body as { displayName: API.DisplayName };
		console.log('Change display name', req.body)


		if (!newDisplayName) { return sendError(reply, "No display name", "displayName") }


		const result = await userManager.changeDisplayName(meId, newDisplayName);

		if (result.ok)
			return sendNoContent(reply);                  // 204

		// map domain reasons to HTTP
		if (result.reason === "not_me") return sendError(reply, "User not found", "id", 404);

		if (result.reason === "taken_displayname") return sendError(reply, "Displayname is taken", "displayname", 409);

		if (result.reason === "weak_displayname") {
			return sendError(reply,
				result.message ?? "Displayname is weak", // from validateName()
				"displayname",
				400);
		}

	});

	//_________________/ME/SETTINGS: CHANGE AVATAR____________
	//_________________/ME/SETTINGS: DELETE USER____________


	//_________________ONLINE/OFFLINE____________

}
