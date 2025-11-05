import { UserPublic, UserSelf } from "../types/api";
import { User } from "../types/domain";

/* return a clean object for frontend (id, name, wins, losses,  online)
This is needed for /user/register and /user/profile
@Task for profile: name,avatar,friends+onlinestatus,stats(wins/losses),match history
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
*/
export function toUserSelf(user: User): UserSelf {
	return {
		id: user.id,
		username: user.username,
		displayName: user.displayName,
		avatarUrl: user.avatarUrl,
	};
}


//TODO: can see online/offline status - can be added later
export function toUserPublic(user: User): UserPublic {
	return {
		id: user.id,
		displayName: user.displayName,
		avatarUrl: user.avatarUrl,
	};


}






