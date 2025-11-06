import Fastify from 'fastify';
import { registerHealthzRoutes } from './routes/healthz';
import { registerRoutes as registerMainRoutes } from './routes/routes';
import { registerChatRoutes } from './routes/chat';
import { registerUserRoutes } from './routes/user';
import { registerAuthRoutes } from './routes/auth';
import { User } from './lib/services/User';
import { UserManager } from './lib/services/UserManager';
import { initDecorators } from './decorators';

const fastify = Fastify();

const userManager = new UserManager()
fastify.register(require('@fastify/cors'), { origin: '*' }) //https://github.com/fastify/fastify-cors

//________________DECORATORS___________________

// The decorated Fastify server is bound to this in route handlers:
// https://fastify.dev/docs/latest/Reference/Decorators/
// installs a global preHandler hook that runs on every request and, if present, copies the auth=<sid> cookie into req.loginSessionId.
initDecorators(fastify); // (A) app-level hook parses "auth" cookie

// sets req.loginSessionId from cookie 
// attaches your userManager to the Fastify instance so you can access it later as req.server.userManager.
fastify.decorate('userManager', userManager); // (B) attach userManager to the server

//_____________________ROUTES REGISTRATION___________________
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


