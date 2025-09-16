import type { FastifyInstance } from 'fastify';


export function registerRoutes(fastify: FastifyInstance) {
  fastify.get('/ping', async () => {
    return { pong: 'it works!' };
  });

  fastify.get('/info/:param', async (req, res) => {
    const { param } = req.params as any;
    return { q: param };
  });
}