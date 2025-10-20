//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax



import type *  as Types from '../types/types';
import * as Validate from '../utils/validators';
// (Luis importing the DTOs to ensure consistency between class and DTOs)
import { UserDbDTO, UserProfileDTO, MatchResultDTO, CreateUserDTO, UserSummaryDTO } from '../../dto/UserDTO'; 

export class User {

	username: string;
	nickname: string;
	readonly id: string; 	// set in constructor, read anywhere in programm, not changeable
	avatarUrl: Types.AvatarUrl; //for .jpg/.phg (later)
	userStatus: Types.UserStatus;
	friendsIds: Set<Types.UserId>; //list of users IDs (easy to check)
	blockedIds: Set<Types.UserId>; //list of users IDs (easy to check)
	matchHistory: Types.MatchResult[];


	static fromDb(row: Record<string, any>): User {
		return new User(row['username'], row['id'])
	}

	toDb(): Record<string, any> {
		return {
			id: this.id,
			username: this.name,
		}
	}

	constructor(name: string, id: string) {

		Validate.ensureNonEmptyString(name, "name");
		Validate.ensureNonEmptyString(id, "name");

		this.username = name;
		this.nickname = name;
		this.id = id;
		this.avatarUrl = "";
		this.userStatus = "online";
		this.friendsIds = new Set();
		this.blockedIds = new Set();
		this.matchHistory = [];
	}

	/* return a clean object for frontend (id, name, wins, losses, friends, online)
	This is needed for /user/register and /user/profile
	@Task for profile: name,avatar,friends+onlinestatus,stats(wins/losses),match history
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 */
	profile() {
		return {
			name: this.name,
			id: this.id,
			bla: 'blabla',

			//TODO: uncomment latter. Dont need now
			// avatarUrl: this.avatarUrl,
			// userStatus: this.userStatus,  
			// friends: [...this.friendsIds],
			// blocked: [...this.blockedIds],
			// wins:	this.resultWon,
			// lost:	this.resultLost,
			// matchHistory: this.matchHistory  

		}
	}

	/* (Luis) Suggestion to improve the profile method with DTOs
	so everytime we change the DTO, we will be forced to change this method
	to ensure consistency between class and DTOs. Let me know what you think.
	toBasicDTO(): UserBasicProfileDTO {
		return {
			name: this.name,
			id: this.id
		};
	}
	*/ 

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
