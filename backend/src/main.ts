import Fastify from 'fastify';
import { registerHealthzRoutes } from './routes/healthz';
import { registerRoutes as registerMainRoutes } from './routes/routes';
import { registerChatRoutes } from './routes/chat';
import { registerUserRoutes } from './routes/user';
import { registerAuthRoutes } from './routes/auth';
import { User } from './lib/services/User';
import { UserManager } from './lib/services/UserManager';

const fastify = Fastify();

const userManager = new UserManager()
fastify.register(require('@fastify/cors'), { origin: '*' }) //https://github.com/fastify/fastify-cors

//fastify register routes
registerMainRoutes(fastify)
registerChatRoutes(fastify)
registerUserRoutes(fastify, userManager)
registerHealthzRoutes(fastify);
registerAuthRoutes(fastify, userManager);


fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`🚀 Server ready at ${address}`);
});


