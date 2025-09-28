import Fastify from 'fastify';
import { registerRoutes as registerMainRoutes } from './routes/routes';
import {registerChatRoutes } from './routes/chat';
import {registerUserRoutes } from './routes/user';
import { User } from './lib/Class/User';
import { UserManager } from './lib/Class/UserManager';

const fastify = Fastify();

const userManager = new UserManager()

//fastify register routes
registerMainRoutes(fastify)
registerChatRoutes(fastify)
registerUserRoutes(fastify, userManager)


fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`🚀 Server ready at ${address}`);
});