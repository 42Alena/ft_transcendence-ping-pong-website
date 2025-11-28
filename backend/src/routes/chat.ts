/* liked used:
https://www.freecodecamp.org/news/learn-async-programming-in-typescript-promises-asyncawait-and-callbacks/

https://fastify.dev/docs/latest/Reference/TypeScript/
*/
import type { FastifyInstance } from 'fastify';
import { ChatManager } from '../lib/services/ChatManager';
import { authRequiredOptions } from './utils';



export function registerChatRoutes(fastify: FastifyInstance, chatManager: ChatManager) {


	/* send private message */
	fastify.post<{ Params: API.TargetIdParams }>(
		"/chat/messages",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { id: targetId } = req.params;  // targetId : string (UserId)

			const result = await chatManager.endUserToUserMessage(meId, targetId);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "self") return sendError(reply, "Cannot add yourself", "id", 400);
			if (result.reason === "not_found") return sendError(reply, "User not found", "id", 404);
			if (result.reason === "blocked") return sendError(reply, "Blocked by user", "blocked", 403);
			if (result.reason === "invalid_content") return sendError(reply, "Not valid message content", "invalid_content", 400);


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