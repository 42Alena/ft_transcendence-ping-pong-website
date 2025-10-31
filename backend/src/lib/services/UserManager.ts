// Used information from links
//  https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
import { Knex, QueryBuilder } from 'knex';
import *  as Types from '../types/types';

import { db } from './DB';
import { User } from './User';

export class UserManager {

	dbTableUser: any
	dbTableFriends: any
	dbTableBlocks: any
	dbTableLoginSessions: any

	constructor() {
		this.dbTableUser = () => db<User>('users');
		this.dbTableFriends = db('friends');
		this.dbTableBlocks = db('blocks');
		this.dbTableLoginSessions = db('login_sessions');
	}

	async getUserByUsername(username: Types.Username): Promise<User | null> {
		const row = await this.dbTableUser().where({ username: username }).first()
		if (!row) {
			return null;
		}
		return User.fromDB(row)
	}



	async getUserById(userId: Types.UserId): Promise<User | null> {
		const row = await this.dbTableUser().where({ id: userId }).first()
		if (!row) {
			return null;
		}
		return User.fromDB(row)
	}


	//____________SAVE_____________________________
	//now for tet only. TODO: delete later
	async saveUser(newUser: User) {
		const data = newUser.toDB()
		console.debug("Saving user", data)
		await this.dbTableUser().insert(data);
	}



	//___________________GET
	async getAllUsers(): Promise<User[]> {
		const dbUsers = await this.dbTableUser().select('*')
		return (dbUsers || []).map(User.fromDB);
	}

	//__________is NAME...
	async isUsernameTaken(username: string): Promise<boolean> {
		const row = await this.dbTableUser()
			.whereRaw('LOWER(displayName) = LOWER(?)', [username])
			.first();
		return !!row;
	}

	async isDisplayNameTaken(displayName: string): Promise<boolean> {
		const row = await this.dbTableUser()
			.whereRaw('LOWER(displayName) = LOWER(?)', [displayName])
			.first();
		return !!row;
	}

	//____________________LOGIN SESSION KEY________________

	async isLoginSessionExist(loginSessionId: Types.LoginSessionId): Promise<boolean> {
		if (!loginSessionId) return false;
		const row = await this.dbTableLoginSessions()
			.where({ id: loginSessionId })
			.first();
		return !!row;
	}

	/* “single-session-per-user” policy (new login replaces old) */
	async saveLoginSession(loginSessionId: Types.LoginSessionId, userId: Types.UserId) {

		await this.dbTableLoginSessions()
			.insert({ id: loginSessionId, userId })
			.onConflict('userId')
			.merge(['id']); 			// update id(on conflict), if exist
	}


	async deleteLoginSession(
		loginSessionId: Types.LoginSessionId,
		userId: Types.UserId
	): Promise<boolean> {

		if (!loginSessionId || !userId) return false;

		const deletedRows = await this.dbTableLoginSessions()
			.where({ id: loginSessionId, userId })
			.delete();

		return deletedRows > 0;  //to bool
	}


	//_________________FRIENDS______________________

	//friend only on 1 site, without approval
	async addFriend(
		userId: Types.UserId,
		friendId: Types.UserId) {

		if (userId === friendId)
			throw new Error(" userId and friendId must be different");


		await this.dbTableFriends()
			.insert({ userId, friendId })
			.onConflict(['userId', 'friendId'])
			.ignore();

	}

	async removeFriend(
		userId: Types.UserId,
		friendId: Types.UserId
	): Promise<number> {

		return await this.dbTableFriends()
			.where({ userId, friendId })
			.delete();

	}

	async isFriend(
		viewerId: Types.UserId, 
		targetId: Types.UserId
	): Promise<boolean> {
		const row = await this.dbTableFriends()
			.where({ userId: viewerId, friendId: targetId })
			.first();

		return !!row;
	}

	//_________________BLOCKED______________________

	//blocked only on 1 site
	async blockUser(userId: Types.UserId, blockedId: Types.UserId) {

		if (userId === blockedId)
			throw new Error(" userId and blockedId: must be different");


		await this.dbTableBlocks()
			.insert({ userId, blockedId })
			.onConflict(['userId', 'blockedId'])
			.ignore();

	}

	async unblockUser(userId: Types.UserId, blockedId: Types.UserId): Promise<number> {

		return await this.dbTableBlocks().where({ userId, blockedId }).del();

	}

	async isBlocked(viewerId: Types.UserId, targetId: Types.UserId): Promise<boolean> {

		const row = await this.dbTableBlocks().where({ userId: viewerId, blockedId: targetId }).first();
		return !!row;
	}




	// //____Status: online | ofline

	// setStatus(status: Types.UserStatus) {
	// 	this.userStatus = status;
	// }



}

/* 

from Standard User Management subject:

Users can securely subscribe to the website

Registered users can securely log in

Users can select a unique display name to participate in tournaments

Users can update their information

Users can upload an avatar (default if none provided)

Users can add others as friends and view their online status

User profiles display stats, such as wins/losses

Each user has a Match History
*/