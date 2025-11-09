//Used documentation:
// https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
// https://www.typescriptlang.org/docs/handbook/2/classes.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax



import type *  as Domain from '../types/domain';


export class User implements Domain.User {

	readonly id: Domain.UserId; 				// set in constructor, read anywhere in programm, not changeable
	username: Domain.Username;
	displayName: Domain.DisplayName;
	passwordHash: Domain.PasswordHash;
	avatarUrl: Domain.AvatarUrl;     //allowed "no avatar" yet; //for .jpg/.png (later)
	lastSeenAt: Domain.TimeSec;                    //changed from userStatus


	constructor(init: Domain.User ) {
		this.id = init.id;
		this.username = init.username;
		this.displayName = init.displayName;
		this.passwordHash = init.passwordHash;
		this.avatarUrl = init.avatarUrl;
		this.lastSeenAt = init.lastSeenAt;
	}
}