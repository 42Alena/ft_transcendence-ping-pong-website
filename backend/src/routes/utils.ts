// https://fastify.dev/docs/latest/Reference/Routes/#shorthand-declaration

import { FastifyReply, FastifyRequest } from "fastify";
import type *  as API from '../lib/types/api';
import { sendError } from "../lib/utils/http";


/* 
 preHandler(request, reply, done): a function called just before the request handler, it could also be an array of functions.
 Runs before protected routes. Requires a valid "auth" cookie,
resolves the userId from session store, and attaches it to req. */
export const authRequiredOptions = {
	preHandler: async (req: FastifyRequest, reply: FastifyReply) => {

		// filled by  global decorator hook  in/decorators.ts( auto fill loginSessionId)
		const loginSessionId = (req as API.UserAwareRequest).loginSessionId;

		// console.log('Hello from prehandler', loginSessionId)  //for debug

		if (!loginSessionId) {
			return sendError(reply, "need cookies", "auth", 401);

		}

		// access userManager  via decoration
		const userId = await (req.server as any).userManager.getUserIdByLoginSession(loginSessionId);

		if (!userId) {
			return sendError(reply, "prehandler: invalid session", "auth", 401);}

		//  attach to request for downstream handlers  (/users/me, etc.)
		(req as API.UserAwareRequest).userId = userId; //  now handlers can read req.userId

	}
};





/* 
old working: saved before rewriting. can be deleted later
export const authRequiredOptions = {
	async preHandler(req: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
		const loginSessionId = (req as API.UserAwareRequest).loginSessionId;
		console.log('Hello from prehandler', loginSessionId)

		if (!loginSessionId) {
			return reply.status(401).send({ error: "need cookies", field: "auth" })
		}

		const userId = await (this as any).userManager.getUserIdByLoginSession(loginSessionId);
		if (!userId) {
			return reply.status(401).send('preHandler: no userId')
		}
		(req as API.UserAwareRequest).userId = userId;

		done()
	}
};

*/