import { GameStatsManager } from "../lib/services/GameStatsManager";
import { authRequiredOptions } from './utils';
import type * as API from '../lib/types/api';
import { sendError, sendNoContent, sendOK } from '../lib/utils/http';

export function registerGameStatsRoutes(fastify: FastifyInstance, gameStatsManager: GameStatsManager) {

	/* send private message (user to user) */
	fastify.post<{ Body: API.SaveGameBody }>(
		"/games/save",
		authRequiredOptions,
		async (req, reply) => { 


		});


}
