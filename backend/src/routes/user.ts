import type { FastifyInstance } from 'fastify';
import { UserManager } from '../lib/Class/UserManager';
// import { User } from '../lib/Class/User';
// import { generateId } from '../lib/utils/generateId';


/* 
/users (collection, public, read-only for now)

GET /users // list public profiles

GET /users/:id // one public profile by id
*/
export function registerUserRoutes(fastify: FastifyInstance, userManager: UserManager) {

	fastify.get("/users", async () => {
		//for test created user
		// const usr1 = new User('usr' + Math.random(), generateId())
		// await userManager.saveUser(usr1)
		//end test created user
		
		const users = await userManager.getAllUsers();
		return users.map((user) => user.profile());
	})

	fastify.get("/users/:userId", async (req, res) => {
		const id = (req.params as any).userId;
		const user = await userManager.getUserById(id);
		if(!user){
			return res.status(404);
		}
		return user.profile();
	})


	// fastify.post("/user", async (req, res) => {
	// 	console.log('Register user', req.body)

	// 	const { name, avatarUrl } = req.body as any;


	// 	try {
	// 		const newUser = new User(name, generateId())

	// 		await userManager.saveUser(newUser)
	// 		return newUser.profile();
	// 	} catch (e: any) {
	// 		return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
	// 	}
	// });

	// const handler = async () => {};
	// fastify.get('/path', handler)

	//register handler


	//TODO: create user id


	/*   FOR LATER
	fastify.post("/user/register", async (req, res) => {
		console.log('Register user', req.body)

		const { name, avatarUrl } = req.body as any;


		try {
			const newUser = new User(name, generateId())

			await userManager.saveUser(newUser)
			return newUser.profile();
		} catch (e: any) {
			return res.status(400).send({ error: e.message }) //Json:{"error":"user \"Alena\" already exist"}%   
		}
	}
	*/
}
