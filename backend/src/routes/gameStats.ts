import { GameStatsManager } from "../lib/services/GameStatsManager";
import { authRequiredOptions } from './utils';
import type * as API from '../lib/types/api';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';

export function registerGameStatsRoutes(fastify: FastifyInstance, gameStatsManager: GameStatsManager) {

	/* 
	mode: "normalGame" | "tournament";
tournamentRound: null | "semi" | "final";
	*/
	fastify.post<{ Body: API.SaveNormalGameBody }>(
		"/games/normal/save",
		authRequiredOptions,
		async (req, reply) => {

			const normalGameBody = gameStatsManager.buildNormalGameFromBody(req.body); 
			const result = await gameStatsManager.recordFinishedGame(normalGameBody);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "not_me")
				return sendError(reply, "Sender not found or not authenticated", "id", 401);
		});


			/* 
	mode: "normalGame" | "tournament";
tournamentRound: null | "semi" | "final";
	*/
	fastify.post<{ Body: API.SaveTournamentBody }>(
		"/games/tournament/save",
		authRequiredOptions,
		async (req, reply) => {


			const result = await gameStatsManager.recordFinishedTournament(req.body);

			if (result.ok)
				return sendNoContent(reply);                  // 204

			// map domain reasons to HTTP
			if (result.reason === "not_me")
				return sendError(reply, "Sender not found or not authenticated", "id", 401);
		});


}


