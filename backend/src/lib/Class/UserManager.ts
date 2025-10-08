// Used information from links
//  https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
import { Knex } from 'knex';
import *  as Types from '../types/types';
import { db } from './DB';
import { User } from './User';

export class UserManager {

	users: Map<Types.UserId, User>;
	dbTable: any;

	constructor() {
		this.users = new Map<Types.UserId, User>;
		this.dbTable = db<User>('users');
	}


	//___________ID__________
	async getUserById(userId: Types.UserId): Promise<User | null> {
		return this.dbTable.where({ id: userId }).select() //alena: try connect to DB
		// return this.users.get(userId) ?? null; //(alena)before try
	}

	async getUserByIdOrThrow(userId: Types.UserId): Promise<User> {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new Error(`User with id=${userId} is not registered in UserManager`);
		}
		return user;
	}


	//____________SAVE
	async saveUser(newUser: User) {
		if (await this.isNameTaken(newUser.name)) {
			throw new Error(`user "${newUser.name}" already exist`)
		}

		console.debug('Saving new user', newUser) //TODO: comment out
		this.users.set(newUser.id, newUser);
		await this.dbTable.insert({ id: newUser.id, username: newUser.name });
	}

	//___________________GET
	async getAllUsers() {
		return Array.from(this.users.values())
	}

	//_________________FRIENDS______________________
	async addFriend(userId: Types.UserId, friendId: Types.UserId) {

		if (userId == friendId)
			throw new Error(" Types.UserId and friendId must be different");


		const user = await this.getUserByIdOrThrow(userId);
		const friend = await this.getUserByIdOrThrow(friendId);

		if (user.isFriend(friendId))
			throw new Error(`Error: "${userId}" and "${friendId}" already friends`);

		user.addFriend(friendId);
		friend.addFriend(userId);
	}

	async removeFriend(userId: Types.UserId, friendId: Types.UserId) {

		const user = await this.getUserByIdOrThrow(userId);
		const friend = await this.getUserByIdOrThrow(friendId);

		if (!user.isFriend(friendId))
			throw new Error(`Error: "${userId}" dont have "${friendId}"`);

		user.removeFriend(friendId);
		friend.removeFriend(userId);
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