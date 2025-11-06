import { FastifyInstance } from "fastify";
import { UserAwareRequest } from "./lib/types/api";

export function initDecorators(fastify: FastifyInstance) {
	// apply before fastify.lsten(Must run BEFORE registering routes that use authRequiredOptions)
	fastify.decorateRequest('userId', null);
	fastify.decorateRequest('loginSessionId', null);

	fastify.addHook('preHandler', async (req) => {

		// parse "auth" cookie into req.loginSessionId (if present)
		//  scan the raw Cookie header and grab the first auth=...
		const cookieHeader = req.headers.cookie || "";

		const allCookiePairs = cookieHeader.split(';');  // "a=1;  auth=XYZ" turns into ["a=1", " auth=XYZ"]

		for (const cookiePair of allCookiePairs) {				

			const trimmedPair = cookiePair.trim();        //   "auth=XYZ"
			if (!trimmedPair.startsWith("auth=")) continue; 

			const equalSignPos = trimmedPair.indexOf('=');    
			if (equalSignPos <= 0) break;                 

			const loginSessionId = trimmedPair.slice(equalSignPos + 1); // "XYZ"
			if (loginSessionId) {
				(req as UserAwareRequest).loginSessionId = loginSessionId;
			}
			break;                              
		}

	})
}
