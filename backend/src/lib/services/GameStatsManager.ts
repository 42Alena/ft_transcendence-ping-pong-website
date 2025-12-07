import { gameToDbRow } from "../mappers/games_db";
import { SaveGameBody } from "../types/api";
import *  as Domain from '../types/domain';
import { unixTimeNow } from "../utils/time";
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



	/* 
   export type SaveGameResult =
	| { ok: true; saved: true }   
	| { ok: true; saved: false }  // valid game, but skipped (AI vs AI or guest vs guest)
	| {
		ok: false;
		reason:
		  | "not_me"             // not authenticated
		  | "invalid_tournament" // bad mode/round combination
		  | "invalid_game"       // structural problem, e.g. same winner/loser, empty alias
		  | "invalid_score";     // winnerScore/loserScore invalid
	  }; 
  
	  export type BaseGame = {
		  mode: GameMode;  "tournament" | "normalGame"
		  tournamentRound:  GameTournamentRound;
  	
		  winnerUserId: PlayerId;
		  loserUserId: PlayerId;
	  	
		  winnerScore: GameScore;
		  loserScore: GameScore;
  	
		  winnerAlias: Alias;            
		  loserAlias: Alias;  
  	
		  createdAt: TimeSec;
	  }
	*/
	async recordFinishedGame(game: Domain.AnyGame): Promise<Domain.SaveGameResult> {

		// if (body.player1Score === body.player2Score) return null;

		if (game.mode === "normalGame" && game.tournamentRound !== null)
			return { ok: false, reason: "invalid_game" };

		if (game.mode === "tournament" &&
			game.tournamentRound !== 'semi' &&
			game.tournamentRound !== 'final') {

			return { ok: false, reason: "invalid_tournament" };
		}


	}


	/* 
buildAnyGameFromBody
	*/
	private buildAnyGameFromBody(body: SaveGameBody): Domain.BaseGame {

		const {
			mode,
			tournamentRound,
			player1Alias,
			player1Score,
			player2Alias,
			player2Score,
		} = body;



		const player1Wins = player1Score >= player2Score;

		const winnerAlias = player1Wins ? player1Alias : player2Alias;
		const loserAlias = player1Wins ? player2Alias : player1Alias;

		const winnerScore = player1Wins ? player1Score : player2Score;
		const loserScore = player1Wins ? player2Score : player1Score;



		const game: Domain.BaseGame = {
			mode,
			tournamentRound,

			winnerUserId: null,  //null for now
			loserUserId: null, //null for now

			winnerAlias,
			loserAlias,

			winnerScore,
			loserScore,


			createdAt: unixTimeNow()
		}

		return game;
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