import Fastify from 'fastify';
import { registerRoutes as registerMainRoutes } from './routes/routes';
import { registerRoutes as registerChatRoutes } from './routes/chat';

const fastify = Fastify();
registerMainRoutes(fastify);
registerChatRoutes(fastify);

fastify.get('/hola', async () => {
	return { opt: 'hi hola', date: new Date() }
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`🚀 Server ready at ${address}`);
});