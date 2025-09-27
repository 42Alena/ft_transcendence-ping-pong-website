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
		if(await this.isNameTaken(newUser.name)){
			throw new Error(`user "${newUser.name}" already exist`)
		}

		console.debug('Saving new user', newUser) //TODO: comment out
		this.users.set(newUser.id, newUser);
	}

	async getAllUsers() {
		return Array.from(this.users.values())
	}

	//_________check
	/* 
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
	some() method of Array, returns true if, in the array..
	 */
	async isNameTaken(name: string): Promise<boolean> {
		const usersArray = Array.from(this.users.values());
	  
		const found = usersArray.some((user) => {
		  return user.name === name;
		});
	  
		return found;
	  }
	  


}

/* 

In Standard User Management, the subject explicitly says:

Users can securely subscribe to the website

Registered users can securely log in

Users can select a unique display name to participate in tournaments

Users can update their information

Users can upload an avatar (default if none provided)

Users can add others as friends and view their online status

User profiles display stats, such as wins/losses

Each user has a Match History
*/