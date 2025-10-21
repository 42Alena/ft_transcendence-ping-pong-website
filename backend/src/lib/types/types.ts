/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
INFO: this types can be used for all project

Add as header at the top of the file:
import *  from '../types/UserTypes';

or what you  special need:

import { UserId, UserStatus, MatchResult } from './types/types';
*/

//___________USER
export type UserStatus = 'online' | 'offline';
export type GameResult = 'won' | 'lost';

export type Username = string;
export type DisplayName = string;
export type UserId = string;
export type AvatarUrl = string;

// Domain (internal)
export type User = {
	readonly id: UserId;
	username: Username;
	displayName: DisplayName;
	avatarUrl: AvatarUrl | null;
	lastSeenAt: Date | null;
};


// User { id: UserId; displayName: DisplayName }
export type UserBasic = Pick<User, 'id' | 'displayName'>;

//    User without the private login field
export type UserPublic = {
	id: UserId;
	displayName: DisplayName;
	avatarUrl: AvatarUrl | null;
};

export type PasswordPlain = string;    //user input, not stored/sended
export type PasswordHash = string;


export type MatchResult = {
	opponentId: UserId;
	date: Date;
	result: GameResult;
};


//_____________CHAT___________
export const SYSTEM_ID = "ThisIsSystemID" as const;
export type SystemId = typeof SYSTEM_ID;

export type Message = string;



export type MessageType =
	| 'PublicMsg'
	| 'PrivateMsg'
	| 'PrivateGameInviteMsg'
	| 'TournamentMsg';


export type SenderId = UserId | SystemId;
export type Receiver = UserId | 'all';

export interface HasPrivateReceiver {
	receiverId: UserId;
}
export interface HasPublicReceiver {
	receiverId: 'all';
}

export interface HasPrivateSender {
	senderId: UserId;
}
export interface HasServerSender {
	senderId: SystemId;
}


// export type Message = {

// 	senderId: UserId | SystemId;       
// 	receiverId: Receiver;    
// 	content: string;
// 	type: MessageType;
// };

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
export interface MessagePublic extends MessageBase {
	type: 'PublicMsg';
	senderId: UserId;
	receiverId: 'all';
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