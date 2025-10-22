//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax



import type *  as Types from '../types/types';
// import * as Validate from '../utils/validators';

/* 
(Alena) Declined DTO suggestion — explanation in UserDto.ts
(Luis) Suggestion to improve the profile method with DTOs
...
*/
// (Luis importing the DTOs to ensure consistency between class and DTOs)
// import { UserDbDTO, UserProfileDTO, MatchResultDTO, CreateUserDTO, UserSummaryDTO } from '../../dto/UserDTO';

export class User implements Types.User {

	readonly id: Types.UserId; 				// set in constructor, read anywhere in programm, not changeable
	username: Types.Username;
	displayName: Types.DisplayName;
	avatarUrl: Types.AvatarUrl | null;     //allow "no avatar" yet; //for .jpg/.png (later)
	lastSeenAt: Date | null;                    //changed from userStatus


	constructor(init: {
		id: Types.UserId;
		username: Types.Username;
		displayName: Types.DisplayName;
		avatarUrl?: Types.AvatarUrl | null;
		lastSeenAt?: Date | null;
	}) {

		this.id = init.id;
		this.username = init.username;
		this.displayName = init.displayName;
		this.avatarUrl = init.avatarUrl ?? null;
		this.lastSeenAt = init.lastSeenAt ?? null;
	}

	// Conversion: DB row =>  User  
	static fromDB(row: Record<string, any>): User {
		return new User({
			id: row.id as Types.UserId,
			username: row.username as Types.Username,
			displayName: row.displayName as Types.DisplayName,
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
			avatarUrl: this.avatarUrl,
			lastSeenAt: this.lastSeenAt ? this.lastSeenAt.toISOString() : null,
		}
	}



/* return a clean object for frontend (id, name, wins, losses,  online)
This is needed for /user/register and /user/profile
@Task for profile: name,avatar,friends+onlinestatus,stats(wins/losses),match history
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
*/
toPublic(): Types.UserPublic {
	return {
		id: this.id,
		displayName: this.displayName,
		avatarUrl: this.avatarUrl,
	};
}

toBasic(): Types.UserBasic {
	return {
		id: this.id,
		displayName: this.displayName,
	};
}


}

