// Used information from links
//  https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
import *  as Types from '../types/types';
import { User } from './User';

export class UserManager {

	users: Map<Types.UserId, User>;

	constructor() {
		this.users = new Map<Types.UserId, User>;
	}


	async getUserById(userId: Types.UserId): Promise<User | null> {
		return this.users.get(userId) ?? null;
	}

	async getUserByIdOrThrow(userId: Types.UserId): Promise<User> {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new Error(`User with id=${userId} is not registered in UserManager`);
		}
		return user;
	}

	async saveUser(newUser: User) {
		console.debug('Saving new user', newUser)
		this.users.set(newUser.id, newUser);
	}

	async getAllUsers() {
		return Array.from(this.users.values())
	}


}