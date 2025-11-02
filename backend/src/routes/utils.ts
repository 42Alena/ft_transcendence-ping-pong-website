// https://fastify.dev/docs/latest/Reference/Routes/#shorthand-declaration

import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import type *  as Types from '../lib/types/api';


// preHandler(request, reply, done): a function called just before the request handler, it could also be an array of functions.

export const authRequiredOptions = {
	async preHandler(req: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
		const loginSessionId = (req as Types.UserAwareRequest).loginSessionId;
		console.log('Hello from prehandler', loginSessionId)

		if (!loginSessionId) {
			return reply.status(401).send({ error: "need cookies", field: "auth" })
		}

		const userId = await (this as any).userManager.getUserIdByLoginSession(loginSessionId);
		if (!userId) {
			return reply.status(401).send('preHandler: no userId')
		}
		(req as Types.UserAwareRequest).userId = userId;

		done()
	}
};

