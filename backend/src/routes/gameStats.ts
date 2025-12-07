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


}


