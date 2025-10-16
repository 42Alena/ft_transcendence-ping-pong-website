import type { FastifyInstance } from 'fastify';

export function registerHealthzRoutes(app: FastifyInstance) {
  app.get('/healthz', async () => ({ ok: true }));
}
