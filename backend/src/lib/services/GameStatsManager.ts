import { gameToDbRow } from "../mappers/games_db";
import { db } from "./DB";
import { User } from "./User";
import { UserManager } from "./UserManager";


export class GameStatsManager {

	dbTableUser: any;
	dbTableGames: any;
	userManager: UserManager;

	constructor(userManager: UserManager) {

		this.dbTableUser = () => db<User>('users');
		this.userManager = userManager;

		// Typed table factories (//= () => anonym fkt =factory fkt). returns a fresh query builder for `messages`
		this.dbTableGames = () => db('games');
	}


  private async saveGameInDB(game: Domain.AnyGame): Promise<void> {

	const dbGameRow = gameToDbRow(game);
	console.debug("Saving game", dbGameRow)   //TODO: comment out, for tests now

	await this.dbTableGames().insert(dbGameRow);
  }

  async recordFinishedGame(game: Domain.AnyGame):
		
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