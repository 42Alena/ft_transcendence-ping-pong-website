/* liked used:
https://www.freecodecamp.org/news/learn-async-programming-in-typescript-promises-asyncawait-and-callbacks/

https://fastify.dev/docs/latest/Reference/TypeScript/
*/
import type { FastifyInstance } from 'fastify';

// const Chat = {
// 	channels: [],
// 	users: [],
// }

export function registerChatRoutes(fastify: FastifyInstance) {
// um 

  fastify.get('/chat', async () => {
	return { msg: 'it doesnt work yet!' };
  });

  fastify.get('/chat/channels', async () => {
	return [
		{ name: 'chann1' }
	]
  })

  // http://localhost/chat/channel/my?messages-since=123123123

  fastify.get('/chat/channel/:channel', async (req) => {
	const channel = (req.params as any).channel;

	// load message history for channel
	// load all users on the current page
	return {
		channel: channel,
		messages: [
			{
				from: 'user1',
				ts: '2025-09-09T23:22:04+00',
				msg: 'Hello people!'
			}
		],
		users: [
			'user1'
		],
	};
  });

  fastify.post('/chat/channel/:channel/join', async (req, res) => {
	const channel = (req.params as any).channel;
	// um..
	// sample
	// Chat.channels[channel].users.push(currentuser)
  });

  fastify.post('/chat/channel/:channel/msg', async (req, res) => {
	const channel = (req.params as any).channel;
	// sample
	// Chat.channels[channel].message.push(.. )
  });

}