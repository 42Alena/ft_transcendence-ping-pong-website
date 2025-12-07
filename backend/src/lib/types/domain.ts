// DOMAIN = use FOR BACKEND ONLY
/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
INFO: this types can be used for all project

Add as header at the top of the file:
import *  from '../types/UserTypes';

or what you  special need:

import { UserId, UserStatus, MatchResult } from './types/types';
*/

import { ReceiverId } from "./api";





//_____________GDPR: delete/anonymize user account
export const DELETED_USER_DISPLAY_NAME = "Deleted user" as const;
export const DELETED_USERNAME = "Deleted_" as const;
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
		reason: "not_me";
	};

export type DeleteAccountResult =
	| { ok: true }
	| {
		ok: false;
		reason: "not_me" | "db_error";
	};

//_____________FRIENDS__________________


export type AddFriendResult =
	| { ok: true }
	| { ok: false; reason: "self" | "not_found" | "blocked" };


// export type RemoveFriendResult = { ok: true };
export type RemoveFriendResult =
	| { ok: true }
	| {
		ok: false;
		reason: "self"
	};


//__________________BLOCKS____________________________

export type BlockUserResult =
	| { ok: true }
	| {
		ok: false;
		reason: "self" | "not_found"
	};


export type UnblockUserResult =
	| { ok: true }
	| {
		ok: false;
		reason: "self"
	};





//_____________CHAT___________

export const SYSTEM_ID = "TOURNAMENT" as const;
export type SystemId = typeof SYSTEM_ID;

export type MessageContent = string;
export type MessageId = number;



// JSON: { "sender":"abc", "message": "hello", ... } or null
// export type Meta =
// 	| null  //for game invite and priate message
// 	| MetaTournamentNextMatch;



export type PrivateSenderId = UserId;
export type PrivateReceiverId = UserId;

export type SenderId = PrivateSenderId | SystemId;
// export type ReceiverId = PrivateSenderId;


export type MessageTypeChat =
	| 'PrivateMessage'
	| 'PrivateGameInviteMessage'
	| 'TournamentMessage';


//to frontent (move to API?)
export type MessageChat = {
	id: MessageId;
	type: MessageTypeChat;
	senderId: SenderId;		// UserId | SystemId
	receiverId: PrivateReceiverId;   // UserId
	content: MessageContent;
	// meta: Meta;				// maybe Meta | null
	createdAt: TimeSec;
};

export type NewMessageChat = Omit<MessageChat, "id" | "createdAt">;

//normal private DM: no meta
export type NewPrivateMessage = {
	type: "PrivateMessage";
	senderId: SenderId;
	receiverId: PrivateReceiverId;
	content: MessageContent;
	// meta: null;
};


export type NewGameInviteMessage = {
	type: "PrivateGameInviteMessage";
	senderId: SenderId;
	receiverId: PrivateReceiverId;
	// content: MessageContent;
	content: typeof MESSAGE_GAME_INVITE;  // always this constant
	// meta: null; // no meta for now
};

// tournament message: meta REQUIRED
export type NewTournamentMessage = {
	type: "TournamentMessage";
	senderId: SystemId;
	receiverId: PrivateReceiverId;
	content: typeof MESSAGE_TOURNAMENT_INVITE;
	// content: MessageContent;
	// meta: MetaTournamentNextMatch;
};

export type NewMessageTypeChat =
	| NewPrivateMessage
	| NewGameInviteMessage
	| NewTournamentMessage;


export type SendMessageResult =
	| { ok: true }
	| {
		ok: false; reason:
		| "not_me"    // sender id != current user / invalid session
		| "no_receiver"
		| "system"    // tried to use SYSTEM_ID where only users are allowed
		| "not_system"    // not SYSTEM_ID for tournament
		| "not_found" // receiver (or sender) doesn’t exist / deleted
		| "blocked"  // receiver has blocked sender
		| "invalid_content";
	};

export type ChatConversations = {
	userId: UserId;
	displayName: DisplayName;      // to show in UI
	avatarUrl: AvatarUrl;  		// to show in UI
};


export type ChatConversationsResult =
	| { ok: true; conversations: ChatConversations[] }
	| { ok: false; reason: "not_me" };

export type ChatConversationWithResult =
	| { ok: true; conversations: ChatConversations[] }
	| { 
		ok: false; reason:
		| "not_me"    // sender id != current user / invalid session
		| "no_receiver" };


export type ChatConversationsItem = {
	userId: UserId;
	displayName: DisplayName;
	avatarUrl: AvatarUrl;
	lastMessageAt: TimeSec;
};

//__________________CHAT + GAME______________


export const MESSAGE_GAME_INVITE = "Let`s play Ping Pong together! :)" as const;
export type MessageGameInvite = typeof MESSAGE_GAME_INVITE;

export const MESSAGE_TOURNAMENT_INVITE = "Your tournament starts now! :)" as const;
export type MessageTournamentInvite = typeof MESSAGE_TOURNAMENT_INVITE;






// // Meta for a direct private game invite (user touser)
// export type MetaGameInvite = {

// 	kind: "game_invite";

// 	// who is inviting whom (both real users)
// 	from: { id: UserId; alias: string };
// 	to: { id: UserId; alias: string };


// 	// invitedAt?: TimeSec;
// 	//message?: string;
// };


export type TournamentAiAlias = typeof TOURNAMENT_AI_ALIASES[number];

export type MetaTournamentNextMatch = {
	kind: "next_match";
	tournamentId: string;
	matchId: string;
	player1: { id: UserId | null; alias: string };
	player2: { id: UserId | null; alias: string };
};

//_____________MATCH______________________
export type MatchResult = {
	opponentId: UserId;
	// date: Date;                //TODO: change from DAte to number as in DB
	result: GameResult;
};


//_____________ CONSTANTS__________________

export const TOURNAMENT_AI_ALIASES = [
	'AI_ALENA',
	'AI_SVEVA',
	'AI_LUIS',
	'AI_42BERLIN',
] as const;

export const AI_NAME_PREFIX = "AI_";
export const AI_NAME_SUFFIX = "_AI";

const RESERVED_NAMES: string[] = [
	'admin',
	'root',
	'null',
	'system',
	'SYSTEM_ID',
	'api',
	'delete',
	'tournament',
	DELETED_USER_DISPLAY_NAME,  // Deleted_
	DELETED_USERNAME,
	SYSTEM_ID,
	...TOURNAMENT_AI_ALIASES,
];
export const RESERVED = RESERVED_NAMES;

// const newObj = Object.assign({}, baseObject, { new: prop })
// const newObj = { ...baseObject, ...{new: prop}}