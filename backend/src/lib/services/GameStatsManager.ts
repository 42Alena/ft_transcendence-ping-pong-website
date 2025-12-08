import { gameFromDbRow, gameToDbRow } from "../mappers/games_db";

import *  as Domain from '../types/domain';
import *  as API from '../types/api';
import { formatDateDDMMYY, unixTimeNow } from "../utils/time";
import { db } from "./DB";
import { User } from "./User";
import { UserManager } from "./UserManager";
import { GameDbRow } from "../types/db";



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




	private async recordFinishedGame(game: Domain.AnyGame): Promise<Domain.SaveGameResult> {

		if (game.winnerAlias === game.loserAlias) {
			return { ok: false, reason: "invalid_game" };
		}


		if (
			game.winnerScore < 0 || game.winnerScore > 3 ||
			game.loserScore < 0 || game.loserScore > 3 ||
			game.winnerScore <= game.loserScore
		)
			return { ok: false, reason: "invalid_score" };

		if (game.mode === 'normalGame' && game.tournamentRound !== null)
			return { ok: false, reason: "invalid_game" };

		if (game.mode === 'tournament' && game.tournamentRound == null)
			return { ok: false, reason: "invalid_tournament" };


		//get User from alias(domainName)
		const winner = await this.userManager.getUserByDisplayname(game.winnerAlias);
		const loser = await this.userManager.getUserByDisplayname(game.loserAlias);

		//if no one user - send ok, not saved
		if (!winner && !loser)
			return { ok: true, saved: false };



		game.winnerUserId = winner ? winner.id : null;
		game.loserUserId = loser ? loser.id : null;

		await this.saveGameInDB(game);

		return { ok: true, saved: true };

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
	async recordTournamentFromBody(
		meId: Domain.UserId | null,
		body: API.SaveTournamentBody
	): Promise<Domain.SaveGameResult> {

		if (!meId)
			return { ok: false, reason: "not_me" };

		const tournament = this.buildTournamentFromBody(body); // private call, OK
		return this.recordFinishedGame(tournament);            // also private call
	}


	private buildUserProfileMatches(
		games: Domain.AnyGame[],
		userId: Domain.UserId
	): Domain.UserProfileMatches {

		return games.map(game => {
			const iAmWinner = game.winnerUserId === userId;

			const opponentAlias = iAmWinner ? game.loserAlias : game.winnerAlias;
			const myScore = iAmWinner ? game.winnerScore : game.loserScore;
			const opponentScore = iAmWinner ? game.loserScore : game.winnerScore;

			const scoreMeOther = `${myScore}-${opponentScore}`;
			const date = formatDateDDMMYY(game.createdAt);

			return {
				opponentAlias,
				date,
				scoreMeOther,
			};
		});
	}




	private buildUserProfileStats(
		games: Domain.AnyGame[],
		userId: Domain.UserId
	): Domain.UserProfileStats {


		const totalGames = games.length;
		let wins = 0;
		let losses = 0;
		let place1 = 0;
		let place2 = 0;
		let place3 = 0;

		for (const game of games) {
			if (game.winnerUserId === userId) wins++;
			if (game.loserUserId === userId) losses++;

			if (game.mode === "tournament") {
				if (game.tournamentRound === "final") {
					if (game.winnerUserId === userId) place1++; // 1st place
					else if (game.loserUserId === userId) place2++; // 2nd place
				} else if (game.tournamentRound === "semi") {
					if (game.loserUserId === userId) place3++; // lost in semi => 3rd
				}
			}
		}

		const winRatePercent = totalGames ? (wins * 100) / totalGames : 0;
		const lossRatePercent = totalGames ? (losses * 100) / totalGames : 0;

		return {
			totalGames,
			wins,
			losses,
			winRatePercent,
			lossRatePercent,
			place1,
			place2,
			place3,
		};


	}


	async getUserProfileGamesAndStats(
		meId: Domain.UserId,
		userId: Domain.UserId
	): Promise<Domain.GetUserProfileGamesAndStatsResult> {

		const me = await this.userManager.getUserById(meId);

		if (!me)
			return { ok: false, reason: "not_me" };

		const user = await this.userManager.getUserById(userId);

		if (!user)
			return { ok: false, reason: "no_user" };


		const dbRows = await this.dbTableGames()
			.where({ winnerUserId: userId })
			.orWhere({ loserUserId: userId })
			.orderBy("createdAt", "desc");


		const games: Domain.AnyGame[] = dbRows.map((row: GameDbRow) => gameFromDbRow(row));

		//_____________GAMES__________________________
		const matches = this.buildUserProfileMatches(games, userId);

		//_____________STATS__________________________
		const stats = this.buildUserProfileStats(games, userId);
		

		return { ok: true, matches, stats };
	}


}
