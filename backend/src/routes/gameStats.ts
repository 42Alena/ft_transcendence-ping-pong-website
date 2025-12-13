import { GameStatsManager } from "../lib/services/GameStatsManager";
import { authRequiredOptions } from './utils';
import type * as API from '../lib/types/api';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';
import { FastifyInstance } from "fastify";

export function registerGameStatsRoutes(fastify: FastifyInstance, gameStatsManager: GameStatsManager) {

	/* 
	mode: "normalGame";
tournamentRound: null;
	*/
	fastify.post<{ Body: API.SaveNormalGameBody }>(
		"/games/normal/save",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const result = await gameStatsManager.recordNormalGameFromBody(meId, req.body);

			if (result.ok) {

				if (result.saved) {
					return sendNoContent(reply); // 204
				}

				// valid but not saved ( AI vs AI, guest vs guest)
				return sendOK(reply, { saved: false });
			}


			if (result.reason === "not_me")
				return sendError(reply, "Not authenticated", "auth", 401);
			if (result.reason === "invalid_tournament")
				return sendError(reply, "Invalid tournament data", "body", 400);
			if (result.reason === "invalid_game")
				return sendError(reply, "Invalid game", "body", 400);
			if (result.reason === "invalid_score")
				return sendError(reply, "Invalid score", "body", 400);
		});


	/* 
mode:  "tournament";
tournamentRound:   "semi" | "final";
*/
	fastify.post<{ Body: API.SaveTournamentBody }>(
		"/games/tournament/save",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { tournamentRound } = req.body;  // tournamentRound : semi | final

			if (tournamentRound !== 'semi' && tournamentRound !== 'final')
				return sendError(reply, "Invalid round in tournament game", "body", 400);

			const result = await gameStatsManager.recordTournamentFromBody(meId, req.body);

			if (result.ok) {

				if (result.saved) {
					return sendNoContent(reply); // 204
				}

				// valid but not saved ( AI vs AI, guest vs guest)
				return sendOK(reply, { saved: false });
			}


			if (result.reason === "not_me")
				return sendError(reply, "Not authenticated", "auth", 401);
			if (result.reason === "invalid_tournament")
				return sendError(reply, "Invalid tournament data", "body", 400);
			if (result.reason === "invalid_game")
				return sendError(reply, "Invalid game", "body", 400);
			if (result.reason === "invalid_score")
				return sendError(reply, "Invalid score", "body", 400);
		});



	fastify.get<{
		Params: API.GetUserParams;
		Reply: API.GetUserProfileGamesAndStatsResponse
	}>(
		"/profile/:userId/stats",
		authRequiredOptions,
		async (req, reply) => {

			const meId = (req as API.UserAwareRequest).userId;  // set by preHandler

			const { userId } = req.params;

			const result = await gameStatsManager.getUserProfileGamesAndStats(meId, userId);

			if (result.ok)
				return sendOK(reply, {
					matches: result.matches,
					stats: result.stats
				});

			if (result.reason === "not_me")
				return sendError(reply, "Not authenticated", "auth", 401);

			if (result.reason === "no_user")
				return sendError(reply, "User not found", "id", 404);

		});



	// Check 2 aliases before starting a match (must be valid + free in DB)
	fastify.post<{ Body: API.CheckMatchAliasesBody; Reply: API.CheckMatchAliasesResponse }>(
		"/games/match/aliases/check",
		// async (req, reply) =>
		// 	sendOK(reply, await gameStatsManager.checkMatchAliases(req.body))

		async (req, reply) => {

			const result = await gameStatsManager.checkMatchAliases(req.body);

			if (result.ok) {
				return sendOK(reply, {
					player1Alias: result.player1Alias,
					player2Alias: result.player2Alias,
				});
			}

			// any invalid input => 400
			return sendError(reply, result.error, "alias", 400);
		}
	);

	
	// Check 4 aliases before starting a tournament (must be valid + free in DB)
	fastify.post<{ Body: API.CheckTournamentAliasesBody; Reply: API.CheckTournamentAliasesResponse }>(
		"/games/tournament/aliases/check",
		// async (req, reply) =>
		// 	sendOK(reply, await gameStatsManager.checkTournamentAliases(req.body))

		async (req, reply) => {

		const result = await gameStatsManager.checkTournamentAliases(req.body);

		if (result.ok) {
			return sendOK(reply, {
				player1Alias: result.player1Alias,
				player2Alias: result.player2Alias,
				player3Alias: result.player3Alias,
				player4Alias: result.player4Alias,
			});
		}

		return sendError(reply, result.error, "alias", 400);
	}
	);



}


