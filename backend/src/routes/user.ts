import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import { authRequiredOptions } from './utils';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';
import { toUserPublic, toUserSelf } from '../lib/mappers/user';
import type * as API from '../lib/types/api';
//for file upload
// import { createWriteStream } from 'node:fs';
// import { pipeline } from 'node:stream/promises';
import { rename, unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { UPLOAD_DIR, URL_AVATAR_PREFIX } from '../config';





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
		if (!meId)
			return sendError(reply, "need cookies", "auth", 401);

		const me = await userManager.getUserById(meId);
		if (!me)
			return sendError(reply, "User not found", "userId", 404);

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
			if (result.reason === "not_found") return sendError(reply, "User not found", "id", 404);

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
		if (result.reason === "not_me") return sendError(reply, "User not found or not authenticated", "id", 404);

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
	  reason: "not_me" |  "weak_password";
	*/
	fastify.patch("/users/me/change-password", authRequiredOptions, async (req, reply) => {

		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler


		const { currentPassword, newPassword } = req.body as API.ChangePasswordBody;

		if (!currentPassword || !newPassword) {
			return sendError(reply, "Missing password fields", "password", 400);
		}

		console.log('Change password', req.body)


		const result = await userManager.changePassword(meId, currentPassword, newPassword);

		if (result.ok)
			return sendNoContent(reply);                  // 204

		// map domain reasons to HTTP
		if (result.reason === "not_me")
			return sendError(reply, "User not found or not authenticated", "id", 404);


		if (result.reason === "wrong_current_password") {
			return sendError(
				reply,
				"Current password is wrong",
				"currentPassword",
				401,
			);
		}
		if (result.reason === "weak_password") {
			return sendError(reply,
				result.message ?? "password is weak", // from validatePassword()
				"password",
				400);
		}

	});

	//_________________/ME/SETTINGS: CHANGE AVATAR____________

	/* 
	Change / upload avatar
Route: POST /users/me/avatar
or PATCH /users/me/avatar (your choice; I’d use POST because of file upload)
Auth: required
Input: multipart form with file field, e.g. avatar
Checks:
validate file type (PNG/JPEG only, size limit)
store file on disk (or in static folder) → get avatarUrl
Uses in UserManager: updateAvatar(userId, avatarUrl
store for users: backend/avatars/users
default: backend/avatars/default/default.png

curl localhost:3000/users/me/avatar -X POST -F "file=@avatars/default/default.png;filename=me.png" 

https://nodejs.org/docs/latest/api/fs.html#fspromisesrenameoldpath-newpath
<form method="POST" enctype="multipart/form-data">
  <input type="file" name="avatar">
</form>
	*/
	fastify.post("/users/me/avatar", authRequiredOptions, async (req, reply) => {


		const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

		const me = await userManager.getUserById(meId);
		if (!me) return sendError(reply, "User not found", "userId", 404);

		const oldAvatarUrl = me.avatarUrl;


		// stores files to tmp dir and return files
		const files = await req.saveRequestFiles()
		console.log('Incoming files', files)

		if (files.length !== 1)
			return sendError(reply, "Avatar: one file only", "avatar", 400);

		if (!(files[0].mimetype.startsWith("image/")))
			return sendError(reply, "Avatar: png or jpeg only", "avatar", 400);

		if (files[0].file.bytesRead < 100)
			return sendError(reply, "Avatar: size", "avatar", 400);

		//get userId for path

		const extention = extname(files[0].filename)
		const fileName = `${meId}${extention}`;
		const dst = join(UPLOAD_DIR, fileName);              // uses global UPLOAD_DIR
		const publicUrl = `${URL_AVATAR_PREFIX}${fileName}`; // uses global prefix
	

		console.log("avatar saving to ", dst)
		await rename(
			files[0].filepath, // src
			dst // dst
		);

		console.log('Change avatar', req.body)

		const result = await userManager.changeAvatar(meId, publicUrl);

		if (result.ok) {

			if (oldAvatarUrl && (oldAvatarUrl !== publicUrl)) {
				if (oldAvatarUrl.startsWith(URL_AVATAR_PREFIX)) {             // NEW: only delete if old avatar was an uploaded file
					const oldFileName = oldAvatarUrl.slice(URL_AVATAR_PREFIX.length) // NEW: strip prefix to get filename
					const oldFsPath = join(UPLOAD_DIR, oldFileName)           // NEW: build old FS path from filename
					await unlink(oldFsPath);                                  // CHANGED: unlink FS path, not URL
				}
				

			}
			
			return sendOK(reply, { avatarUrl: publicUrl });  //   url where saved, return URL (usable in <img src>


		}

		// map domain reasons to HTTP
		if (result.reason === "not_me")
			return sendError(reply, "User not found or not authenticated", "id", 404);


	});


	//_________________/ME/SETTINGS: DELETE USER____________

	/* 
	delete user account
	rename his displayname to "Deleted user":
	*/
	fastify.delete(
		"/users/me",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			console.log('Delete user, GDPR', req.body)

			const result = await userManager.deleteAccountGDPR(meId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			if (result.reason === "not_me")
				return sendError(reply, "User not found or not authenticated", "id", 404);


		});

	//_________________ONLINE/OFFLINE____________




	/* to get online status for me or friends only. TODO: change Online time in config.ts. now for tests 15 sec */
	fastify.get<{ Params: API.TargetIdParams }>(
		"/users/:id/status", authRequiredOptions, async (req, reply) => {

			const viewerId = (req as API.UserAwareRequest).userId;

			const { id: targetId } = req.params;

			const result = await userManager.getUserOnlineStatus(viewerId, targetId);

			// map domain result to HTTP
			if (!result.ok) {
				if (result.reason === "not_me")
					return sendError(reply, "User not found or not authenticated", "auth", 401);

				if (result.reason === "not_found")
					return sendError(reply, "User not found", "userId", 404);

				if (result.reason === "not_friend")
					return sendError(reply, "User not my friend", "userId", 403);

				return;
			}

			// here result.ok === true
			return sendOK(reply, { status: result.status });  // online | offline
		});

}

