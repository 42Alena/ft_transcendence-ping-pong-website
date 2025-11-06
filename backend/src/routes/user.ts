import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/services/UserManager';
import { authRequiredOptions } from './utils';
import { sendOK } from '../lib/utils/http';
import { toUserPublic } from '../lib/mappers/user';
import { GetUserParams } from '../lib/types/api';
// import { User } from '../lib/Class/User';
// import { generateId } from '../lib/utils/generateId';

// type GetUserParams = { userId: Types.UserId };
/* 
/users (collection, public, read-only for now)

GET /users // list public profiles

GET /users/:id // one public profile by id
*/
export function registerUserRoutes(fastify: FastifyInstance, userManager: UserManager) {

	// GET /users → public list (displayName + avatarUrl + id)
	fastify.get("/users", authRequiredOptions, async (req, reply) => {

		const users = await userManager.getAllUsers();

		return sendOK(reply, users.map(toUserPublic), 200);

	})


	// fastify.get('/users/me', ...)


	// /users/123
	// /users/124
	fastify.get<{ Params: GetUserParams }>(
		"/users/:userId",
		authRequiredOptions,
		async (request, reply) => {
			const { userId } = request.params;   //params: validates the params
			// (https://fastify.dev/docs/latest/Reference/Routes/)
			// const id = (request.params as any).userId;
			const user = await userManager.getUserById(userId);
			if (!user) {
				return reply.code(404).send({ error: "User not found" });
			}

			return sendOK(reply, toUserPublic(user), 200)
		})





}
