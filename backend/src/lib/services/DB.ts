import { Knex, knex } from 'knex';
import path from 'path';
//https://knexjs.org/guide/query-builder.html#where
const DB_PATH = path.join(__dirname, "../../../db/pong.db")

const config: Knex.Config = {
	client: 'sqlite3',
	connection: {
		filename: DB_PATH,
	},
	useNullAsDefault: true, // for SQLite: treat missing fields as NULL, hide warning
};


export const db = knex(config); // will always return obj to work with db

export const getUser = (userId: string) => {
	const query = "SELECT * FROM users WHERE blalba"
	// run query(query)
}