/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
use:
import *  from '../types/UserTypes';
or 
import { UserId, UserStatus, MatchResult } from './types/types';
*/

import { FastifyRequest } from "fastify";

// backend/public/avatars/default.png
export type Username = string;
export type DisplayName = string;
export type UserId = string;
export type AvatarUrl = string;
export type LoginSessionId = string;

//_________ Auth secrets (backend-only)_____________

export type PasswordPlain = string;    //user input, not stored/sended
export type PasswordHash = string;   //backend only!


//for 4xx,5xx errors
export type ApiError = { error: string; code?: string; details?: unknown };

//________USER
type GetUserParams = { userId: UserId };

//_______REQ bodies (waht client POST)___________

export type RegisterBody = {
	username: Username;
	displayName: DisplayName;
	avatarUrl: AvatarUrl | null;
	passwordPlain: PasswordPlain;
};

export type LoginBody = {
	username: Username;
	passwordPlain: PasswordPlain;
};


//______________User shape (what clients see)_____________
// export type UserPublic = {
// 	id: UserId;
// 	displayName: DisplayName;
// 	avatarUrl: AvatarUrl | null;
// };


//_________PROFILE__send_ to_FRONTEND___________________


//   all  others public users. Without username(all other users)
export type UserPublic = {
	id: UserId;
	displayName: DisplayName;    //public
	avatarUrl: AvatarUrl | null;
};

//    User's own profile with username
// User { id: UserId; displayName: DisplayName, ... }
export type UserSelf = UserPublic & {
	readonly username: Username;       //only for own profile
};




//______________REPLY COMMON______________

export type MeResponse = UserPublic;


export type RegisterResponse = UserPublic;
export type LoginResponse = UserPublic;

export type UserAwareRequest = FastifyRequest & {
	userId: string;
	loginSessionId: string;
}