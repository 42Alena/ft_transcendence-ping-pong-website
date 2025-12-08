import { gameToDbRow } from "../mappers/games_db";

import *  as Domain from '../types/domain';
import *  as API from '../types/api';
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



	private computeGameResult(body: Domain.GamePlayersScores): Domain.GameWinnersLosers {

		const {
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



		const game: Domain.GameWinnersLosers = {

			winnerAlias,
			loserAlias,

			winnerScore,
			loserScore,
		}

		return game;
	}



	private buildNormalGameFromBody(body: API.SaveNormalGameBody): Domain.NormalGame {

		const result = this.computeGameResult(body as Domain.GamePlayersScores);

		return {
			mode: 'normalGame',
			tournamentRound: null,
			winnerUserId: null,
			loserUserId: null,
			...result,
			createdAt: unixTimeNow(),
		};
	}

	private buildTournamentFromBody(body: API.SaveTournamentBody): Domain.TournamentGame {

		const result = this.computeGameResult(body as Domain.GamePlayersScores);

		return {
			mode: 'tournament',
			tournamentRound: body.tournamentRound,
			winnerUserId: null,
			loserUserId: null,
			...result,
			createdAt: unixTimeNow(),
		};

	}




	/* 
	PRIVATE
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
	private async recordFinishedGame(game: Domain.AnyGame): Promise<Domain.SaveGameResult> {


		const winner = await this.userManager.getUserByDisplayname(game.winnerAlias);
		const loser = await this.userManager.getUserByDisplayname(game.loserAlias);

		if (!winner && !loser)
			return { ok: true, saved: false };

		game.winnerUserId = winner ? winner.id : null;
		game.loserUserId = loser ? loser.id : null;
		

		//get User from alias(domainName)
		//if no one user - send ok, not saved
		// if (body.player1Score === body.player2Score) return null;



		// if ()

		// 	return { ok: false, reason: "invalid_tournament" };
		// }


	}


	// PUBLIC: called from route for normal game
	public async recordNormalGameFromBody(
		meId: Domain.UserId | null,
		body: API.SaveNormalGameBody
	): Promise<Domain.SaveGameResult> {

		if (!meId)
			return { ok: false, reason: "not_me" };

		const game = this.buildNormalGameFromBody(body); // private call, OK
		return this.recordFinishedGame(game);            // also private call
	}



	// PUBLIC: called from route for tournament
	public async recordTournamentFromBody(
		meId: Domain.UserId | null,
		body: API.SaveTournamentBody
	): Promise<Domain.SaveGameResult> {

		if (!meId)
			return { ok: false, reason: "not_me" };

		const tournament = this.buildTournamentFromBody(body); // private call, OK
		return this.recordFinishedGame(tournament);            // also private call
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