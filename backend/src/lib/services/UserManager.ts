// Used information from links
//  https://www.Domaincriptlang.org/docs/handbook/2/mapped-types.html
import { Knex, QueryBuilder } from 'knex';

import *  as Domain from '../types/domain';

import { db } from './DB';
import { User } from './User';           // class used only here
import { userFromDbRow, userToDbRow } from '../mappers/user_db';
import { generateId } from '../utils/randomId';
import { hashPassword, verifyPassword } from '../utils/password';
import { normalizeName, validateName, validatePassword } from '../utils/validators';
import { unixTimeNow } from '../utils/time';


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



	//_______________bool: existence_____________________
	async existsById(userId: Domain.UserId): Promise<boolean> {

		const row = await this.dbTableUser().where({ id: userId }).first("id");

		return !!row;
	}

	async existsByUsername(username: Domain.Username): Promise<boolean> {

		const row = await this.dbTableUser().where({ username }).first("id");

		return !!row;
	}

	private isDeletedAccount(user: Domain.User | null): boolean {

		return !user || user.deletedAt !== 0;
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

		const dbUsers = await this.dbTableUser()
			.where({ deletedAt: 0 })
			.select('*');

		return (dbUsers || []).map(userFromDbRow);
	}

	//__________REGISTER + SAVE inDB_____________
	async registerUser(params: Domain.RegisterUserParams): Promise<Domain.User> {

		const user = new User({
			id: generateId(),
			username: params.username,
			displayName: params.displayName,
			passwordHash: await hashPassword(params.passwordPlain),
			avatarUrl: params.avatarUrl,
			lastSeenAt: 0, // never seen (updated on login/activity. 0 = never seen yet)
			deletedAt: 0,   // active (0 = active, >0 = deletion time)
		})

		await this.saveUserInDb(user);   // reuse the single insert path
		return user;
	};


	async saveUserInDb(user: Domain.User): Promise<void> {

		const dbRow = userToDbRow(user);

		console.debug("Saving user", dbRow)   //TODO: comment out, for tests now

		await this.dbTableUser().insert(dbRow);
	}


	//__________is UNIQUE____________________ 
	async isUsernameTaken(username: Domain.Username): Promise<boolean> {
		const row = await this.dbTableUser()
			.whereRaw('LOWER(username) = LOWER(?)', [username])
			.first();
		return !!row;
	}

	async isDisplayNameTaken(displayName: Domain.DisplayName): Promise<boolean> {
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
			.first() as
			| { userId: Domain.UserId }
			| undefined;;

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

	async getMyFriends(userId: Domain.UserId): Promise<Domain.User[]> {

		const rows = await this.dbTableUser()
			.join('friends', 'users.id', 'friends.friendId') //join users and friends tables
			.where('friends.userId', userId)                 // WHERE f.userId = :userId
			.andWhere('users.deletedAt', 0)
			.select('users.*')                             // only user columns
			.orderBy('users.displayName');

		return rows.map(userFromDbRow);
	}


	//add friend only on 1 side(me) 
	async addFriend(
		meId: Domain.UserId,
		targetId: Domain.UserId
	): Promise<Domain.AddFriendResult> {

		if (meId === targetId)
			return { ok: false, reason: "self" };

		const target = await this.getUserById(targetId);
		if (this.isDeletedAccount(target))
			return { ok: false, reason: "not_found" };

		if (await this.isBlockedByMeOrByOther(meId, targetId))
			return { ok: false, reason: "blocked" };

		await this.dbTableFriends()
			.insert({ userId: meId, friendId: targetId })
			.onConflict(['userId', 'friendId'])
			.ignore();

		return { ok: true };
	}


	async removeFriend(
		meId: Domain.UserId,
		targetId: Domain.UserId
	): Promise<Domain.RemoveFriendResult> {

		if (meId === targetId)
			return { ok: false, reason: "self" };

		await this.dbTableFriends()
			.where({ userId: meId, friendId: targetId })
			.delete();

		// always OK (idempotent)
		return { ok: true };
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

	async getMyBlocks(userId: Domain.UserId

	): Promise<Domain.User[]> {

		const rows = await this.dbTableUser()
			.join('blocks', 'users.id', 'blocks.blockedId') //join users and blocks tables
			.where('blocks.userId', userId)                 // who I blocked
			.andWhere('users.deletedAt', 0)
			.select('users.*')                             // only user columns
			.orderBy('users.displayName');

		return rows.map(userFromDbRow);
	}


	//blocked only on 1 side, keep also as friend
	async blockUser(
		meId: Domain.UserId,
		targetId: Domain.UserId
	): Promise<Domain.BlockUserResult> {

		if (meId === targetId)
			return { ok: false, reason: "self" };

		const target = await this.getUserById(targetId);
		if (this.isDeletedAccount(target))
			return { ok: false, reason: "not_found" };

		await this.dbTableBlocks()
			.insert({ userId: meId, blockedId: targetId })
			.onConflict(['userId', 'blockedId'])
			.ignore();

		return { ok: true };
	}

	async unblockUser(
		meId: Domain.UserId,
		targetId: Domain.UserId
	): Promise<Domain.UnblockUserResult> {

		if (meId === targetId)
			return { ok: false, reason: "self" };


		await this.dbTableBlocks().where({ userId: meId, blockedId: targetId }).del();

		return { ok: true };
	}

	async isBlocked(meId: Domain.UserId, targetId: Domain.UserId): Promise<boolean> {

		const row = await this.dbTableBlocks().where({ userId: meId, blockedId: targetId }).first();
		return !!row;
	}


	async isBlockedByMeOrByOther(
		meId: Domain.UserId,
		targetId: Domain.UserId
	): Promise<boolean> {
		const row = await this.dbTableBlocks()
			.where({ userId: meId, blockedId: targetId })
			.orWhere({ userId: targetId, blockedId: meId })
			.first('userId');
		return !!row;
	}

	//_________________/ME/SETTINGS: CHANGE DISPLAY NAME____________


	async changeDisplayName(
		meId: Domain.UserId,
		newDisplayName: Domain.DisplayName,
	): Promise<Domain.ChangeDomainNameResult> {


		const me = await this.getUserById(meId);
		if (this.isDeletedAccount(me))
			return { ok: false, reason: "not_me" };

		const nameNormalized = normalizeName(newDisplayName);


		const validationError = validateName(nameNormalized);
		if (validationError) {
			return { ok: false, reason: "weak_displayname", message: validationError, };
		}

		if (await this.isDisplayNameTaken(nameNormalized)) return { ok: false, reason: "taken_displayname" };

		console.log('normalized', nameNormalized)
		//update
		await this.dbTableUser()
			.update({ displayName: nameNormalized })
			.where({ id: meId });

		return { ok: true };
	};


	//_________________/ME/SETTINGS: CHANGE PASSWORD ____________

	async changePassword(
		meId: Domain.UserId,
		currentPassword: Domain.PasswordPlain,
		newPassword: Domain.PasswordPlain,
	): Promise<Domain.ChangePasswordResult> {


		const me = await this.getUserById(meId);
		if (!me)
			return { ok: false, reason: "not_me" };


		const checkCurrentVsStoredHashedPass = await verifyPassword(currentPassword, me.passwordHash);

		if (!checkCurrentVsStoredHashedPass)
			return { ok: false, reason: "wrong_current_password" };



		const validationError = validatePassword(newPassword, me.username, me.displayName);
		if (validationError) {
			return { ok: false, reason: "weak_password", message: validationError, };
		}


		const hashedPassword = await hashPassword(newPassword)

		console.log("password", newPassword, hashedPassword);

		//update
		await this.dbTableUser()
			.update({ passwordHash: hashedPassword })
			.where({ id: meId });

		return { ok: true };
	};


	//_________________/ME/SETTINGS: CHANGE AVATAR____________

	async changeAvatar(
		meId: Domain.UserId,
		avatarUrlNew: Domain.AvatarUrl,
	): Promise<Domain.ChangeAvatarResult> {

		const me = await this.getUserById(meId);
		if (this.isDeletedAccount(me))
			return { ok: false, reason: "not_me" };

		//update
		await this.dbTableUser()
			.update({ avatarUrl: avatarUrlNew })
			.where({ id: meId });

		return { ok: true };

	};


	//_________________/ME/SETTINGS: DELETE USER____________

	/* 
	 GDPR: anonymize user, mark as deleted, remove sessions, friends, blocks.
	*/
	async deleteAccountGDPR(
		meId: Domain.UserId,
	): Promise<Domain.DeleteAccountResult> {

		const me = await this.getUserById(meId);
		if (this.isDeletedAccount(me))
			return { ok: false, reason: "not_me" };



		//delete/anonymize  account
		await this.dbTableUser()
			.update({
				displayName: Domain.DELETED_USER_DISPLAY_NAME + meId,
				username: Domain.DELETED_USERNAME + meId,
				avatarUrl: Domain.DELETED_AVATARURL,
				deletedAt: unixTimeNow(),
			})
			.where({ id: meId });

		// delete login sessions for this user
		await this.dbTableLoginSessions()
			.where({ userId: meId })
			.delete();

		//deletete from friends for both users
		await this.dbTableFriends()
			.where({ userId: meId })
			.orWhere({ friendId: meId })
			.delete();

		//delete from blocks for both
		await this.dbTableBlocks()
			.where({ userId: meId })
			.orWhere({ blockedId: meId })
			.delete();

		return { ok: true };

	};


	//_________________ONLINE/OFFLINE____________




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