import type {FastifyReply} from 'fastify';

//sendOK(res, user.toSelfProfile(), 201); for non 200
export function sendOK<T>(reply: FastifyReply, payload: T, statusCode = 200) {
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
