/* liked used:
https://www.freecodecamp.org/news/learn-async-programming-in-typescript-promises-asyncawait-and-callbacks/

https://fastify.dev/docs/latest/Reference/TypeScript/
*/
import type { FastifyInstance } from 'fastify';
import { ChatManager } from '../lib/services/ChatManager';
import { authRequiredOptions } from './utils';
import type * as API from '../lib/types/api';
import { sendError, sendNoContent } from '../lib/utils/http';
import { SYSTEM_ID } from '../lib/types/domain';


export function registerChatRoutes(fastify: FastifyInstance, chatManager: ChatManager) {




	/* send private message */
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


	/* send tournament message  fromn System */
	fastify.post<{ Body: API.SendTournamentMessageBody }>(
		"/chat/messages/tournament",
		authRequiredOptions,
		async (req, reply) => {

			const { receiverId } = req.body;  // targetId : string (UserId)

			const result = await chatManager.sendTournamentMessage(receiverId);

			if (result.ok)
				return sendNoContent(reply);                  // 204


			if (result.reason === "no_receiver")
				return sendError(reply, "Receiver not found", "id", 404);

		});





}

//old working as copy
// const Chat = {
// 	channels: [],
// 	users: [],
// }
// export function registerChatRoutes(fastify: FastifyInstance) {


//   fastify.get('/chat', async () => {
// 	return { msg: 'it doesnt work yet!' };
//   });

//   fastify.get('/chat/channels', async () => {
// 	return [
// 		{ name: 'chann1' }
// 	]
//   })

//   // http://localhost/chat/channel/my?messages-since=123123123

//   fastify.get('/chat/channel/:channel', async (req) => {
// 	const channel = (req.params as any).channel;

// 	// load message history for channel
// 	// load all users on the current page
// 	return {
// 		channel: channel,
// 		messages: [
// 			{
// 				from: 'user1',
// 				ts: '2025-09-09T23:22:04+00',
// 				msg: 'Hello people!'
// 			}
// 		],
// 		users: [
// 			'user1'
// 		],
// 	};
//   });

//   fastify.post('/chat/channel/:channel/join', async (req, res) => {
// 	// get user from req
// 	// const currentUser = await getUserFromRequest(req)
// 	// if no user -> 401
// 	const channel = (req.params as any).channel;
// 	// um..
// 	// sample
// 	// Chat.channels[channel].users.push(currentuser)
//   });

//   fastify.post('/chat/channel/:channel/msg', async (req, res) => {
// 	const channel = (req.params as any).channel;
// 	// sample
// 	// Chat.channels[channel].message.push(.. )
//   });

// }