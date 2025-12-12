/* liked used:
https://www.freecodecamp.org/news/learn-async-programming-in-typescript-promises-asyncawait-and-callbacks/

https://fastify.dev/docs/latest/Reference/TypeScript/
*/
import type { FastifyInstance } from 'fastify';
import { ChatManager } from '../lib/services/ChatManager';
import { authRequiredOptions } from './utils';
import type * as API from '../lib/types/api';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';
import { SYSTEM_ID } from '../lib/types/domain';


export function registerChatRoutes(fastify: FastifyInstance, chatManager: ChatManager) {




	/* send private message (user to user) */
	fastify.post<{ Body: API.SendPrivateMessageBody }>(
		"/chat/messages",
		authRequiredOptions,
		async (req, reply) => {

			const senderId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { receiverId, content } = req.body;  // targetId : string (UserId)

			const result = await chatManager.sendPrivateMessage(senderId, receiverId, content);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "not_me")
				return sendError(reply, "Sender not found or not authenticated", "id", 401);

			if (result.reason === "no_receiver")
				return sendError(reply, "Receiver not found", "id", 404);

			if (result.reason === "blocked")
				return sendError(reply, "Blocked by sender/receiver", "blocked", 403);

			if (result.reason === "invalid_content")
				return sendError(reply, "Not valid message content", "invalid_content", 400);

		});



	/* send game invite message */
	fastify.post<{ Body: API.SendGameInviteBody }>(
		"/chat/messages/game-invite",
		authRequiredOptions,
		async (req, reply) => {

			const senderId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { receiverId } = req.body;  // targetId : string (UserId)

			const result = await chatManager.sendPrivateGameInviteMessage(senderId, receiverId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "not_me")
				return sendError(reply, "Sender not found or not authenticated", "id", 401);

			if (result.reason === "no_receiver")
				return sendError(reply, "Receiver not found", "id", 404);

			if (result.reason === "blocked")
				return sendError(reply, "Blocked by sender/receiver", "blocked", 403);

		});

		
	//NEW: change from receiverId to check displayname
	/* send tournament message  fromn System */
	fastify.post<{ Body: API.SendTournamentMessageBody }>(
		"/chat/messages/tournament",
		authRequiredOptions,
		async (req, reply) => {

			const { receiverDisplayname } = req.body;  // targetId : string (UserId)

			const result = await chatManager.sendTournamentMessage(receiverDisplayname);

			if (result.ok)
				return sendNoContent(reply);                  // 204


			if (result.reason === "no_receiver")
				return sendError(reply, "Receiver not found", "id", 404);

		});


	/* get sidebar - list all users + their displaynames  for All conversations */
	fastify.get<{ Reply: API.GetChatConversationsResult }>(
		"/chat/conversations",
		authRequiredOptions,
		async (req, reply) => {


			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler


			const result = await chatManager.getConversations(meId);

			if (result.ok)
				return sendOK(reply, result.conversations)

			// map domain reasons to HTTP
			if (result.reason === "not_me")
				return sendError(reply, "User not found or not authenticated", "id", 401);

		});


	/* 
	get conversation between  me and other user or notification from system 
	*/
	fastify.get<{
		Params: API.GetUserParams;
		Reply: API.GetChatConversationWithResult
	}>(
		"/chat/conversations/:userId",
		authRequiredOptions,
		async (req, reply) => {


			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler
			const { userId: receiverId } = req.params;

			const result = await chatManager.getConversationWith(meId, receiverId);

			if (result.ok)
				return sendOK(reply, result.conversations)

			// map domain reasons to HTTP
			if (result.reason === "not_me")
				return sendError(reply, "User not found or not authenticated", "id", 401);

			if (result.reason === "no_receiver")
				return sendError(reply, "Receiver not found", "id", 404);

		});


}
