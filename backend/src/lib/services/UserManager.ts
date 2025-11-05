// Used information from links
//  https://www.Domaincriptlang.org/docs/handbook/2/mapped-types.html
import { Knex, QueryBuilder } from 'knex';

import *  as Domain from '../types/domain';

import { db } from './DB';
import { User } from './User';           // class used only here
import { userFromDbRow, userToDbRow } from '../mappers/user_db';
import { generateId } from '../utils/randomId';
import { hashPassword } from '../utils/password';

export class UserManager {

	dbTableUser: any
	dbTableFriends: any
	dbTableBlocks: any
	dbTableLoginSessions: any

	constructor() {
		// Typed table factories (//= () => anonym fkt =factory fkt)
		this.dbTableUser = () => db<User>('users');
		this.dbTableFriends = () => db('friends');
		this.dbTableBlocks = () => db('blocks');
		this.dbTableLoginSessions = () => db('login_sessions');
	}

	//_______________READ__________________

	async getUserByUsername(username: Domain.Username): Promise<Domain.User | null> {
		const row = await this.dbTableUser().where({ username: username }).first()
		if (!row) {
			return null;
		}
		return userFromDbRow(row)
	}


	async getUserById(userId: Domain.UserId): Promise<Domain.User | null> {
		const row = await this.dbTableUser().where({ id: userId }).first()
		if (!row) {
			return null;
		}
		return userFromDbRow(row)
	}

	async getAllUsers(): Promise<Domain.User[]> {
		const dbUsers = await this.dbTableUser().select('*')
		return (dbUsers || []).map(userFromDbRow);
	}

	//__________CREATE
	async createUser(params: Domain.CreateUserParams): Promise<Domain.User> {
		const user = new User({
			id: generateId(),
			username: params.username,
			displayName: params.displayName,
			passwordHash: await hashPassword(params.passwordPlain),
			avatarUrl: params.avatarUrl,
			lastSeenAt: null, // set on login/ping later
		})

		await this.saveUser(user);   // reuse the single insert path
		return user;
	};


	//____________SAVE_____________________________
	//now for tet only. TODO: delete later
	async saveUser(newUser: User) {
		const data = userToDbRow()
		console.debug("Saving user", data)
		await this.dbTableUser().insert(data);
	}



	//___________________GET


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

	async getUserIdByLoginSession(
		loginSessionId: Domain.LoginSessionId
	): Promise<Domain.UserId | null> {

		if (!loginSessionId) return null;

		const row = await this.dbTableLoginSessions()
			.where({ id: loginSessionId })
			.first() as { userId: Domain.UserId } | undefined;;

		if (!row) return null;

		return row.userId;
	}

	async isLoginSessionExist(loginSessionId: Domain.LoginSessionId): Promise<boolean> {
		if (!loginSessionId) return false;
		const row = await this.dbTableLoginSessions()
			.where({ id: loginSessionId })
			.first();
		return !!row;
	}


	async saveLoginSession(
		loginSessionId: Domain.LoginSessionId,
		userId: Domain.UserId
	) {

		await this.dbTableLoginSessions()
			.insert({ id: loginSessionId, userId })
	}



	//___________________LOGOUT______________
	async deleteLoginSession(
		loginSessionId: Domain.LoginSessionId,
		userId: Domain.UserId
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
		userId: Domain.UserId,
		friendId: Domain.UserId) {

		if (userId === friendId)
			throw new Error(" userId and friendId must be different");


		await this.dbTableFriends()
			.insert({ userId, friendId })
			.onConflict(['userId', 'friendId'])
			.ignore();

	}

	async removeFriend(
		userId: Domain.UserId,
		friendId: Domain.UserId
	): Promise<number> {

		return await this.dbTableFriends()
			.where({ userId, friendId })
			.delete();

	}

	async isFriend(
		viewerId: Domain.UserId,
		targetId: Domain.UserId
	): Promise<boolean> {
		const row = await this.dbTableFriends()
			.where({ userId: viewerId, friendId: targetId })
			.first();

		return !!row;
	}

	//_________________BLOCKED______________________

	//blocked only on 1 site
	async blockUser(userId: Domain.UserId, blockedId: Domain.UserId) {

		if (userId === blockedId)
			throw new Error(" userId and blockedId: must be different");


		await this.dbTableBlocks()
			.insert({ userId, blockedId })
			.onConflict(['userId', 'blockedId'])
			.ignore();

	}

	async unblockUser(userId: Domain.UserId, blockedId: Domain.UserId): Promise<number> {

		return await this.dbTableBlocks().where({ userId, blockedId }).del();

	}

	async isBlocked(viewerId: Domain.UserId, targetId: Domain.UserId): Promise<boolean> {

		const row = await this.dbTableBlocks().where({ userId: viewerId, blockedId: targetId }).first();
		return !!row;
	}




	// //____Status: online | ofline

	// setStatus(status: Domain.UserStatus) {
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