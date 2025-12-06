import Fastify from 'fastify';
import { registerHealthzRoutes } from './routes/healthz';
import { registerRoutes as registerMainRoutes } from './routes/routes';
import { registerChatRoutes } from './routes/chat';
import { registerUserRoutes } from './routes/user';
import { registerAuthRoutes } from './routes/auth';
import { registerGameStatsRoutes } from './routes/gameStats';
import { UserManager } from './lib/services/UserManager';
import { initDecorators } from './decorators';
import { ChatManager } from './lib/services/ChatManager';
import { GameStatsManager } from './lib/services/GameStatsManager';


const fastify = Fastify();

const userManager = new UserManager()
const chatManager = new ChatManager(userManager)
const gameStatsManager = new GameStatsManager(userManager)

fastify.register(require('@fastify/cors'), { origin: '*' }) //https://github.com/fastify/fastify-cors

//for file upload
fastify.register(require('@fastify/multipart'))


//________________DECORATORS___________________
// The decorated Fastify server is bound to this in route handlers:
// https://fastify.dev/docs/latest/Reference/Decorators/


// 1) Parse "auth" cookie on every request and put the value into req.loginSessionId.
//  Call this BEFORE registering routes that use authRequiredOptions.
initDecorators(fastify);  

// 2) Attach userManager to the Fastify instance.
//    In any handler/preHandler you can access it as: req.server.userManager.
//    Do this BEFORE registering routes.
fastify.decorate('userManager', userManager);

//_____________________ROUTES REGISTRATION___________________
//fastify register routes
registerMainRoutes(fastify)
registerChatRoutes(fastify, chatManager)
registerUserRoutes(fastify, userManager)
registerHealthzRoutes(fastify);
registerAuthRoutes(fastify, userManager);
registerGameStatsRoutes(fastify, gameStatsManager);


fastify.listen({ port: 3000, host: '0.0.0.0' }, (err: Error | null, address: string) => {
  if (err) throw err;
  console.log(`🚀 Server ready at ${address}`);
});