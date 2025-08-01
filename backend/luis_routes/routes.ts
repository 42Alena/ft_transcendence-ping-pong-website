import type { FastifyInstance } from 'fastify';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.get('/ping', async () => {
    return { pong: 'it works!' };
  });
}