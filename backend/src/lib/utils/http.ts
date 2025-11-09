
//FOR FASTIFY ROUTES HANDLERS

import type { FastifyReply } from 'fastify';


//sendOK(res, user.toSelfProfile(), 201); for non 200
export function sendOK<T>(
	reply: FastifyReply,
	payload: T,
	statusCode = 200
): FastifyReply {
	return reply.status(statusCode).send(payload);
}

export function sendError(
	reply: FastifyReply,
	error: string,
	field: string,
	statusCode = 400): FastifyReply {
	// { [field]: error }
	return reply.status(statusCode).send({ error, field })
}

//add friena/remove...
//return sendNoContent(reply);
export function sendNoContent(
	reply: FastifyReply
): FastifyReply {
	return reply.status(204).send();
}


/* 
try {
  const user = await userManager.createUser(...);
  return sendOK(reply, toUserSelf(user), 201);
} catch (e: any) {
  // if you use AppError: map code/http/field here
  return sendError(reply, e.message ?? "Failed", "general", 400);
}

*/
