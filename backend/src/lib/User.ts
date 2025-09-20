//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date


export type UserStatus = 'online' | 'offline';
export type GameResult = 'win' | 'lose';
export type UserId = string;


export type MatchResult = {
	opponentId: UserId;
	date: Date;
	result: 'win' | 'lose';
  };

export class User {

	name: string;
	id: string;
	userStatus: UserStatus;
	gamesWin: number;
	gamesLose: number;
	friendsIds: Set<UserId>; //list of users IDs (easy to check)
	blockedIds: Set<UserId>; //list of users IDs (easy to check)
	// avatarUrl: string; //for .jpg/.phg (later)

	constructor(name: string, id: string) {

		this.name = name;
		this.id = id;
		this.userStatus = 'online';
		this.gamesWin = 0;
		this.gamesLose = 0;
		this.friendsIds = new Set ();
		this.blockedIds = new Set ();
	}
//________Game
	addWon() {
		this.gamesWin += 1;
	}

	addLost() {
		this.gamesLose += 1;
	}

	setStatus(status: UserStatus) {
		this.userStatus = status;
	}

	//_______ Friends____________

	addFriend(userId: UserId) {

		this.friendsIds.add(userId);
	}

	removeFriend(userId: UserId) {
		this.friendsIds.delete(userId);
	}



	isFriend(userId: UserId): boolean {
		return this.friendsIds.has(userId);
	}

	//_______ Blocked Id____________

	blockId(userId: UserId) {

		this.blockedIds.add(userId);
	}

	unblockId(userId: UserId) {
		this.blockedIds.delete(userId);
	}



	isBlocked(userId: UserId): boolean {
		return this.blockedIds.has(userId);
	}

}
