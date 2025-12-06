import { db } from "./DB";


export class GameStatsManager {

	dbTableGames: any;
	userManager: UserManager;

	constructor(userManager: UserManager) {

		this.userManager = userManager;

		// Typed table factories (//= () => anonym fkt =factory fkt). returns a fresh query builder for `messages`
		this.dbTableGames = () => db('games');
	}

	

		
}


/*
	
* 
from USER class. Need adapt
	
	
	//________Game
	addMatch(opponentId: Types.UserId, result: Types.GameResult) {
		this.matchHistory.push({
			opponentId: opponentId,
			date: new Date(),  //TODO: change from Date to number
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
	
	
*/