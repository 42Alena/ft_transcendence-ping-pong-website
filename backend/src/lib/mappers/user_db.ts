

//moved from class User


import { User } from "../services/User"
import type *  as Domain from '../types/domain';

// Conversion: DB row =>  User  
export function userFromDbRow(row: any): Domain.User {
	return  {
    id: row.id,
    username: row.username,
    displayName: row.displayName,
    passwordHash: row.passwordHash,
    avatarUrl: row.avatarUrl ?? null,
    lastSeenAt: row.lastSeenAt ?? null,     // number|null from DB
	}
}


// Conversion:    User =>  DB row
export function userToDbRow(user: Domain.User) {
	return {
		id: user.id,
		username: user.username,
		displayName: user.displayName,
		passwordHash: user.passwordHash,
		avatarUrl: user.avatarUrl,
		lastSeenAt: user.lastSeenAt,    // number|null to DB
	}
}



