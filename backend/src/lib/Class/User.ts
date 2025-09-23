//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter


import *  as Types from '../types/types';
import * as Validate from '../utils/validators';

export class User {

	name: string;
	readonly id: string; 	// set in constructor, read anywhere in programm, not changeable
	avatarUrl: Types.AvatarUrl; //for .jpg/.phg (later)
	userStatus: Types.UserStatus;
	friendsIds: Set<Types.UserId>; //list of users IDs (easy to check)
	blockedIds: Set<Types.UserId>; //list of users IDs (easy to check)
	matchHistory: Types.MatchResult[];

	constructor(name: string, id: string) {
		
		Validate.ensureNonEmptyString(name, "name");
		Validate.ensureNonEmptyString(id, "name");

		this.name = name;
		this.id = id;
		this.avatarUrl = "";
		this.userStatus = "online";
		this.friendsIds = new Set();
		this.blockedIds = new Set();
		this.matchHistory = [];
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

	//_______ Blocked Id____________

	blockId(userId: Types.UserId) {

		this.blockedIds.add(userId);
	}

	unblockId(userId: Types.UserId) {
		this.blockedIds.delete(userId);
	}



	isBlocked(userId: Types.UserId): boolean {
		return this.blockedIds.has(userId);
	}

}
