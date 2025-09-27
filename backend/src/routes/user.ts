import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/Class/UserManager';
import { User } from '../lib/Class/User';
import { generateId } from '../lib/utils/generateId';


export function registerUserRoutes(fastify: FastifyInstance, userManager: UserManager) {

	fastify.post("/user/register", async (req, res) => {
		console.log('Register user', req.body)

		const { name, avatarUrl } = req.body as any;


		try {
			const newUser = new User(name, generateId())

			await userManager.saveUser(newUser)
			return newUser.profile();
		} catch (e: any) {
			return res.status(400).send({error: e.message}) //Json:{"error":"user \"Alena\" already exist"}%   
		}
	});


	// const handler = async () => {};
	// fastify.get('/path', handler)

	//register handler
	fastify.get("/users", async () => {
		const users = await userManager.getAllUsers();
		return users.map((user) => user.profile());
	})

	//TODO: create user id
}