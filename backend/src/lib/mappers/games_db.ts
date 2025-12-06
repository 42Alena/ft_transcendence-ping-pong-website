import { GameDbInsertRow, GameDbRow } from "../types/db";
import type *  as Domain from '../types/domain';


export function gameFromDbRow(row: GameDbRow): Domain.BaseGame {
	if (row.mode === "tournament") {
		return {

			mode: "tournament",
			tournamentRound: row.tournamentRound as Domain.TournamentRound,

			winnerUserId: row.winnerUserId,
			loserUserId: row.loserUserId,

			winnerScore: row.winnerScore,
			loserScore: row.loserScore,

			winnerAlias: row.winnerAlias,
			loserAlias: row.loserAlias,

			createdAt: row.createdAt
		};
	}

	// Normal game: round must be null
	return {

		mode: "normalGame",
		tournamentRound: null,

		winnerUserId: row.winnerUserId,
		loserUserId: row.loserUserId,

		winnerScore: row.winnerScore,
		loserScore: row.loserScore,

		winnerAlias: row.winnerAlias,
		loserAlias: row.loserAlias,

		createdAt: row.createdAt
	}

}



export function gameToDbRow(game: Domain.AnyGame): GameDbInsertRow {
	return {

		mode: game.mode,
		tournamentRound: game.tournamentRound,

		winnerUserId: game.winnerUserId,
		loserUserId: game.loserUserId,

		winnerScore: game.winnerScore,
		loserScore: game.loserScore,

		winnerAlias: game.winnerAlias,
		loserAlias: game.loserAlias,

	}
}