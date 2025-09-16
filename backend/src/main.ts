import Fastify from 'fastify';
import { registerRoutes as registerLuisRoutes } from './routes/routes.ts';

const fastify = Fastify();
registerLuisRoutes(fastify); // <- plug in your routes

fastify.get('/hola', async () => {
	return { opt: 'hi hola', date: new Date() }
})

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`🚀 Server ready at ${address}`);
});