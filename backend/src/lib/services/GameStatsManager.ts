import { gameFromDbRow, gameToDbRow } from "../mappers/games_db";

import *  as Domain from '../types/domain';
import *  as API from '../types/api';
import { formatDateDDMMYY, unixTimeNow } from "../utils/time";
import { db } from "./DB";
import { User } from "./User";
import { UserManager } from "./UserManager";
import { GameDbRow } from "../types/db";
import { normalizeName, validateName } from "../utils/validators";



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

		let winRatePercent = 0;
		let lossRatePercent = 0;

		if (totalGames > 0) {
			winRatePercent = Math.round((wins * 100) / totalGames);
			lossRatePercent = 100 - winRatePercent;
		}


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


	//______NEW _ CHECK PLAYERS BEFORE MATCH OR TOURNAMENT_________


	private isAiAlias(normalizedName: string): boolean {

		const key = normalizedName.toUpperCase();

		return (Domain.TOURNAMENT_AI_ALIASES as readonly string[])
			.some(ai => ai.toUpperCase() === key);
	}



	/*  allow passing my own displayName (optional)
	 - guest call: meDisplayName is undefined -> old behavior
	 - logged-in call: meDisplayName is "Alena" -> allow it even if taken in DB*/
	private async checkNames(
		namesRaw: string[],
		meDisplayName?: string
	): Promise<{ ok: true; names: string[] } | { ok: false; error: string }> {

		const names = namesRaw.map(normalizeName);

		// 1) empty after normalize
		for (let i = 0; i < names.length; i++) {
			if (names[i].length === 0)
				return { ok: false, error: `Player ${i + 1}: name is empty.` };
		}

		// 2) validate each (AI aliases allowed)
		for (let i = 0; i < names.length; i++) {
			if (this.isAiAlias(names[i]))
				continue;

			const err = validateName(names[i]);
			if (err)
				return { ok: false, error: `Player ${i + 1}: ${err}` };
		}

		// 3) duplicates (case-insensitive) for ALL names (including AI)
		{
			const seen = new Set<string>();

			for (const n of names) {
				const k = n.toLowerCase();

				if (seen.has(k))
					return { ok: false, error: `Duplicate: "${n}" is used more than once.` };

				seen.add(k);
			}
		}

		// 4) taken in DB ONLY for non-AI names
		for (let i = 0; i < names.length; i++) {
			if (this.isAiAlias(names[i]))
				continue;

			const taken = await this.userManager.isDisplayNameTaken(names[i] as any);

			// NEW: if name is taken BUT it is MY OWN displayName -> allow
			if (taken && meDisplayName && names[i].toLowerCase() === meDisplayName.toLowerCase())
				continue;

			if (taken)
				return { ok: false, error: `Player ${i + 1}: name "${names[i]}" already exists.` };
		}

		return { ok: true, names };
	}





	// 2 players
	public async checkMatchAliases(
		body: { player1Alias: Domain.Alias; player2Alias: Domain.Alias; },
		meDisplayName?: string // NEW optional
	): Promise<Domain.CheckMatchAliasesResult> {

		// Must provide exactly 2 aliases (both required fields)
		if (!body || body.player1Alias == null || body.player2Alias == null)
			return { ok: false, error: "Please enter 2 player names." };

		//pass meDisplayName (undefined for guests, string for logged-in)
		const r = await this.checkNames([body.player1Alias, body.player2Alias], meDisplayName);
		if (!r.ok) return { ok: false, error: r.error };

		return { ok: true, player1Alias: r.names[0], player2Alias: r.names[1] };
	}




	// 4 players
	public async checkTournamentAliases(
		body: {
			player1Alias: Domain.Alias;
			player2Alias: Domain.Alias;
			player3Alias: Domain.Alias;
			player4Alias: Domain.Alias;
		},
		meDisplayName?: string //  optional
	): Promise<Domain.CheckTournamentAliasesResult> {

		// Must provide exactly 4 aliases (all required fields)
		if (
			!body ||
			body.player1Alias == null ||
			body.player2Alias == null ||
			body.player3Alias == null ||
			body.player4Alias == null
		)
			return { ok: false, error: "Please enter 4 player names." };

		//  pass meDisplayName (undefined for guests, string for logged-in)
		const r = await this.checkNames(
			[body.player1Alias, body.player2Alias, body.player3Alias, body.player4Alias],
			meDisplayName
		);
		if (!r.ok) return { ok: false, error: r.error };

		return {
			ok: true,
			player1Alias: r.names[0],
			player2Alias: r.names[1],
			player3Alias: r.names[2],
			player4Alias: r.names[3],
		};

		 async sendTournamentMessage
	}


	//  Wrapper: guest OR authenticated
	public async checkMatchAliasesWithMe(
		meId: Domain.UserId | undefined,
		body: { player1Alias: Domain.Alias; player2Alias: Domain.Alias; }
	): Promise<Domain.CheckMatchAliasesResult> {

		// guest flow: no meId => validate as-is
		if (!meId)
			return this.checkMatchAliases(body);

		// authenticated flow: force player1Alias = my displayName
		const me = await this.userManager.getUserById(meId);
		if (!me)
			return { ok: false, error: "User not found" }; // route turns into 400; if you want 404, handle in route

		const forcedBody = {
			...body,
			player1Alias: me.displayName as any, // ignore whatever client sent
		};

		//  pass me.displayName so your checkNames() allows it even if taken
		return this.checkMatchAliases(forcedBody, me.displayName);
	}


	// Wrapper: guest OR authenticated
	public async checkTournamentAliasesWithMe(
		meId: Domain.UserId | undefined,
		body: {
			player1Alias: Domain.Alias;
			player2Alias: Domain.Alias;
			player3Alias: Domain.Alias;
			player4Alias: Domain.Alias;
		}
	): Promise<Domain.CheckTournamentAliasesResult> {

		// guest flow
		if (!meId)
			return this.checkTournamentAliases(body);

		// authenticated flow
		const me = await this.userManager.getUserById(meId);
		if (!me)
			return { ok: false, error: "User not found" };

		const forcedBody = {
			...body,
			player1Alias: me.displayName as any, // ignore client player1
		};

		// pass me.displayName so your checkNames() allows it even if taken
		return this.checkTournamentAliases(forcedBody, me.displayName);
	}


}
