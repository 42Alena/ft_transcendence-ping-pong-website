//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax



import type *  as Types from '../types/types';
import * as Validate from '../utils/validators';

/* 
(Alena) Declined DTO suggestion — explanation in UserDto.ts
(Luis) Suggestion to improve the profile method with DTOs
...
*/
// (Luis importing the DTOs to ensure consistency between class and DTOs)
// import { UserDbDTO, UserProfileDTO, MatchResultDTO, CreateUserDTO, UserSummaryDTO } from '../../dto/UserDTO';

export class User implements Types.User {

	readonly id: Types.UserId; 				// set in constructor, read anywhere in programm, not changeable
	username: Types.Username;
	displayName: Types.DisplayName;
	avatarUrl: Types.AvatarUrl | null;     //allow "no avatar" yet; //for .jpg/.png (later)
	wins: number;
	losses: number;
	lastSeenAt: Date | null;                    //changed from userStatus



	static fromDb(row: Record<string, any>): User {
		return new User(row['username'], row['id'])
	}

	toDb(): Record<string, any> {
		return {
			id: this.id,
			username: this.username,
		}
	}

	constructor(init: {
		id: Types.UserId;
		username: Types.Username;
		displayName: Types.DisplayName;
		avatarUrl?: Types.AvatarUrl | null;
		wins?: number;
		losses?: number;
		lastSeenAt?: Date | null;
	}) {

		this.id = init.id;
		this.username = init.username;
		this.displayName = init.displayName;
		this.avatarUrl = init.avatarUrl ?? null;
		this.wins = init.wins ?? 0;
		this.losses = init.losses ?? 0;
		this.lastSeenAt = init.lastSeenAt ?? null;
	}

	//for test only
	static fromName(id: Types.UserId, name: string) { return new User({ id, username: name, displayName: name }); }

	/* return a clean object for frontend (id, name, wins, losses,  online)
	This is needed for /user/register and /user/profile
	@Task for profile: name,avatar,friends+onlinestatus,stats(wins/losses),match history
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 */
	profilePublic(): Types.UserPublic {
		return {
			id: this.id,
			displayName: this.displayName,
			avatarUrl: this.avatarUrl,
			wins: this.wins,
			losses: this.losses,
			lastSeenAt: this.lastSeenAt,
		};
	}
	
	profileBasic(): Types.UserBasic {
		return { id: this.id, displayName: this.displayName };
	}



	//________Game
	addMatch(opponentId: Types.UserId, result: Types.GameResult) {
		this.matchHistory.push({
			opponentId: opponentId,
			date: new Date(),
			result: result
		});
	}

	get resultWon(): number {
		const wins = this.matchHistory.filter(match => match.result == "won");
		return wins.length;
	}

	get resultLost(): number {
		const lose = this.matchHistory.filter(match => match.result == "lost");
		return lose.length;
	}


	//____Status: online | ofline

	setStatus(status: Types.UserStatus) {
		this.userStatus = status;
	}

	//_______ Friends____________

	addFriend(userId: Types.UserId) {

		this.friendsIds.add(userId);
	}

	removeFriend(userId: Types.UserId) {
		this.friendsIds.delete(userId);
	}


	isFriend(userId: Types.UserId): boolean {
		return this.friendsIds.has(userId);
	}

	//_______ Un/Blocked____________

	blockId(userId: Types.UserId) {

		this.blockedIds.add(userId);
	}

	unblockId(userId: Types.UserId) {
		this.blockedIds.delete(userId);
	}



	isBlocked(userId: Types.UserId): boolean {
		return this.blockedIds.has(userId);
	}

	ensureNotBlockedByOrThrow(userId: Types.UserId): void {
		if (this.isBlocked(userId)) {
			throw new Error(`User ${userId} is blocked by ${this.id}`);
		}
	}

	// TOD get UserProfile

}
