// DOMAIN = use FOR BACKEND ONLY
/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
INFO: this types can be used for all project

Add as header at the top of the file:
import *  from '../types/UserTypes';

or what you  special need:

import { UserId, UserStatus, MatchResult } from './types/types';
*/

//_____________GDPR: delete/anonymize user account
export const DELETED_USER_DISPLAY_NAME = "Deleted user";
export const DELETED_USERNAME = "Deleted_";
export const DELETED_AVATARURL = null;
// export type DeletedUser = null;
// export type UserOrDeleted = User | DeletedUser;

//_______________Primitives, single source of truth_____________
export type Username = string;
export type DisplayName = string;
export type UserId = string;
export type AvatarUrl = string | null;
export type TimeSec = number; // unix epoch seconds.  0 = not set/active, >0 = timestamp


export type PasswordPlain = string;    //user input, not stored/sended
export type PasswordHash = string;
export type LoginSessionId = string;



export type GameResult = 'won' | 'lost';




//___________USER_____FOR DOMAIN(BACKEND) only__________________________


export type User = {

	readonly id: UserId;
	username: Username;

	// Backend-only field; never expose to clients.
	passwordHash: PasswordHash;

	displayName: DisplayName;
	avatarUrl: AvatarUrl;
	lastSeenAt: TimeSec;   // default=0. updated on login/activity. 0 = never seen yet

	// for account deletion, gdpr
	deletedAt: TimeSec; // 0 = active, >0 = deletion time
};

export type RegisterUserParams = {
	username: Username;
	displayName: DisplayName;
	passwordPlain: PasswordPlain;
	avatarUrl: AvatarUrl;
};



//_____________ONLINE/OFFLINE__________________

export type UserStatus = 'online' | 'offline';

export type UserStatusResult =
  | { ok: true; status: UserStatus }
  | { ok: false; reason: 'not_me' | 'not_friend' | 'not_found' };
  

//_____________SETTINGS__________________

export type ChangeDomainNameResult =
	| { ok: true }
	| {
		ok: false;
		reason: "not_me" | "taken_displayname" | "weak_displayname";
		message?: string;   // <-- from validateName()
	};

export type ChangePasswordResult =
	| { ok: true }
	| {
		ok: false;
		reason: "not_me" | "wrong_current_password" | "weak_password";
		message?: string;   // <-- from validatePassword()
	};

export type ChangeAvatarResult =
	| { ok: true }
	| {
		ok: false;
		reason: "not_me";};

export type DeleteAccountResult =
	| { ok: true }
	| {
		ok: false;
		reason: "not_me" |  "db_error";};

//_____________FRIENDS__________________


export type AddFriendResult =
	| { ok: true }
	| { ok: false; reason: "self" | "not_found" | "blocked" };


// export type RemoveFriendResult = { ok: true };
export type RemoveFriendResult =
	| { ok: true }
	| { ok: false;
		reason: "self" };


//__________________BLOCKS____________________________

export type BlockUserResult =
	| { ok: true }
	| { ok: false; 
		reason: "self"  | "not_found"};


export type UnblockUserResult = 
 	|{ ok: true }
	| { ok: false;
		 reason: "self" };


//_____________MATCH______________________
export type MatchResult = {
	opponentId: UserId;
	// date: Date;                //TODO: change from DAte to number as in DB
	result: GameResult;
};


//_____________CHAT___________
export const SYSTEM_ID = "ThisIsSystemID" as const;
export type SystemId = typeof SYSTEM_ID;

export type Message = string;



export type MessageType =
	| 'PrivateMsg'
	| 'PrivateGameInviteMsg'
	| 'TournamentMsg';


export type SenderId = UserId | SystemId;
export type Receiver = UserId ;

export interface HasPrivateReceiver {
	receiverId: UserId;
}


export interface HasPrivateSender {
	senderId: UserId;
}
export interface HasServerSender {
	senderId: SystemId;
}

/* 
used info for interface:
https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
interface= object
*/
export interface MessageBase {

	senderId: SenderId;
	content: Message;
};

export interface MessagePrivate extends MessageBase {
	type: 'PrivateMsg';
	senderId: UserId; 	 //override MessageBase: must be a real user
	receiverId: UserId;
}

export interface MessagePrivateGameInvite extends MessageBase {
	type: 'PrivateGameInviteMsg';
	senderId: UserId;
	receiverId: UserId;
}
export interface MessageTournament extends MessageBase {
	type: 'TournamentMsg';
	senderId: SystemId;
	receiverId: UserId;  //who will play in tournament
}

//__________________GAME______________

export const MESSAGE_GAME_INVITE = "Let`s play Ping Pong together! :)" as const;
export type MessageGameInvite = typeof MESSAGE_GAME_INVITE;

export const MESSAGE_TOURNAMENT_INVITE = "Your tournament starts now! :)" as const;
export type MessageTournamentInvite = typeof MESSAGE_TOURNAMENT_INVITE;