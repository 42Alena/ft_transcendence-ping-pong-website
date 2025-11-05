//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax



import type *  as Types from '../types/domain';
// import * as Validate from '../utils/validators';


// If only this file needs it, keep it local:
type UserInit = Types.User & { passwordHash: Types.PasswordHash };

export class User implements Types.User {

	readonly id: Types.UserId; 				// set in constructor, read anywhere in programm, not changeable
	username: Types.Username;
	displayName: Types.DisplayName;
	passwordHash: Types.PasswordHash;
	avatarUrl: Types.AvatarUrl | null;     //allow "no avatar" yet; //for .jpg/.png (later)
	lastSeenAt: Date | null;                    //changed from userStatus


	constructor(init: UserInit) {
		this.id = init.id;
		this.username = init.username;
		this.displayName = init.displayName;
		this.passwordHash = init.passwordHash;
		this.avatarUrl = init.avatarUrl ?? null;
		this.lastSeenAt = init.lastSeenAt ?? null;
	}

	// Conversion: DB row =>  User  
	static fromDB(row: Record<string, any>): User {
		return new User({
			id: row.id as Types.UserId,
			username: row.username as Types.Username,
			displayName: row.displayName as Types.DisplayName,
			passwordHash: row.passwordHash as Types.PasswordHash,
			avatarUrl: (row.avatarUrl ?? null) as Types.AvatarUrl | null,
			lastSeenAt: row.lastSeenAt ? new Date(row.lastSeenAt) : null,
		})
	}


	// Conversion:    User =>  DB row
	toDB() {
		return {
			id: this.id,
			username: this.username,
			displayName: this.displayName,
			passwordHash: this.passwordHash,
			avatarUrl: this.avatarUrl,
			lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
		}
	}

