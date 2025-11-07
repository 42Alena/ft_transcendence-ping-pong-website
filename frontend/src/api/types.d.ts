/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
use:
import *  from '../types/UserTypes';
or 
import { UserId, UserStatus, MatchResult } from './types/types';
*/

export type Username = string;
export type DisplayName = string;
export type UserId = string;
export type AvatarUrl = string;

//_________ Auth secrets  sent once (never store in state) ──────────
export type PasswordPlain = string; // user input, sent to server once; do NOT persist


//for 4xx,5xx errors
export type ApiError = { error: string; code?: string; details?: unknown };


//_______REQ bodies (waht client POST)___________

export type RegisterBody = {
	username: Username;
	displayName: DisplayName;
	avatarUrl?: AvatarUrl | null;
	passwordPlain: PasswordPlain;
};

export type LoginBody = {
	username: Username;
	passwordPlain: PasswordPlain;
};

 
//______________User shape (what clients see)_____________
export type UserPublic = {
	id: UserId;
	displayName: DisplayName;
	avatarUrl: AvatarUrl | null;
};

//______________RES COMMON______________

export type MeResponse = UserPublic;

// cookie-based auth: server sets cookie, body returns user
export type RegisterResponse = UserPublic;

export type LoginResponse = UserPublic;
