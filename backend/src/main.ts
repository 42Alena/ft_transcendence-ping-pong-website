import Fastify from 'fastify';
import { registerHealthzRoutes } from './routes/healthz';
import { registerRoutes as registerMainRoutes } from './routes/routes';
import {registerChatRoutes } from './routes/chat';
import {registerUserRoutes } from './routes/user';
import { User } from './lib/Class/User';
import { UserManager } from './lib/Class/UserManager';

const fastify = Fastify();

const userManager = new UserManager()
fastify.register(require('@fastify/cors'), { origin: '*' }) //https://github.com/fastify/fastify-cors

//fastify register routes
registerMainRoutes(fastify)
registerChatRoutes(fastify)
registerUserRoutes(fastify, userManager)
registerHealthzRoutes(fastify);


fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`🚀 Server ready at ${address}`);
});


