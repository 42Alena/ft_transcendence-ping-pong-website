import { UserDbRow } from '../types/db';
import type *  as Domain from '../types/domain';



// Conversion: DB row =>  User  
export function userFromDbRow(row: UserDbRow): Domain.User {
	return {
		id: row.id,
		username: row.username,
		displayName: row.displayName,
		passwordHash: row.passwordHash,
		avatarUrl: row.avatarUrl,
		lastSeenAt: row.lastSeenAt,
		deletedAt: row.deletedAt,
	}
}


// Conversion:    User =>  DB row
export function userToDbRow(user: Domain.User): UserDbRow {
	return {
		id: user.id,
		username: user.username,
		displayName: user.displayName,
		passwordHash: user.passwordHash,
		avatarUrl: user.avatarUrl,
		lastSeenAt: user.lastSeenAt,
		deletedAt: user.deletedAt,
	}
}
