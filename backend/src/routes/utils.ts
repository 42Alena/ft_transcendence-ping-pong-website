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
		const userManager = (req.server as any).userManager;

		const userId = await userManager.getUserIdByLoginSession(loginSessionId);

		if (!userId) {
			return sendError(reply, "prehandler: invalid session", "auth", 401);}

		await userManager.touchLastSeenAt(userId);  //for online status

		//  attach to request for downstream handlers  (/users/me, etc.)
		(req as API.UserAwareRequest).userId = userId; //  now handlers can read req.userId

	}
};

/* Optional auth preHandler:
   - If cookie/session is valid -> sets req.userId
   - If missing/invalid -> do nothing (guest allowed)
*/
export const authOptionalOptions = {
  preHandler: async (req: FastifyRequest, reply: FastifyReply) => {
    const loginSessionId = (req as API.UserAwareRequest).loginSessionId;

    //  guest: no cookie => just continue, no error
    if (!loginSessionId) return;

    const userManager = (req.server as any).userManager;
    const userId = await userManager.getUserIdByLoginSession(loginSessionId);

    //  guest/expired: invalid session => treat as guest, no error
    if (!userId) return;

    await userManager.touchLastSeenAt(userId);

    //  authenticated path: attach userId
    (req as API.UserAwareRequest).userId = userId;
  }
};
