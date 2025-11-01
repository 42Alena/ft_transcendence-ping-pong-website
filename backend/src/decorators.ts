import { FastifyInstance } from "fastify";
import { UserAwareRequest } from "./lib/types/api";

export function initDecorators(fastify: FastifyInstance) {
	// apply before fastify.lsten
	fastify.decorateRequest('userId', null);
	fastify.decorateRequest('loginSessionId', null);

	fastify.addHook('preHandler', (req, reply, done) => {
		const allCookies: string = req.headers['cookie'] ?? ''

		const pairs: string[] = allCookies
			.split(';')
			.map((a: string) => a.trim())
			.filter((a: string) => a.startsWith("auth="));

		if (pairs?.length === 1) {
			const [, loginSessionId] = pairs[0].split('=');
			(req as UserAwareRequest).loginSessionId = loginSessionId;
		}

		done()
	})
}