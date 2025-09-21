/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html

this types can be used for all project

Add as header at the top of the file:
import *  from '../types/UserTypes';

or what you  special need:

import { UserId, UserStatus, MatchResult } from './types/types';
*/

//___________USER
export type UserStatus = 'online' | 'offline';
export type GameResult = 'won' | 'lost';
export type UserId = string;
export type AvatarUrl = string;



export type MatchResult = {
	opponentId: UserId;
	date: Date;
	result: GameResult;
};

//_____________CHAT___________
export const SYSTEM_ID = "ThisIsSystemID" as const;
export type SystemId = typeof SYSTEM_ID;


export type MessageType =
	| 'PublicMsg'      
	| 'PrivateMsg'       
	| 'PrivateGameInviteMsg'   
	| 'TournamentMsg';   

export type Receiver = UserId | 'all';

export type Message = {

	senderId: UserId | SystemId;       
	receiverId: Receiver;    
	content: string;
	type: MessageType;
};
