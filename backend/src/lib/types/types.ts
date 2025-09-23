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


export type SenderId = UserId | SystemId;
export type Receiver = UserId | 'all';

export interface HasPrivateReceiver{
	receiverId: UserId;	
}
export interface HasPublicReceiver{
	receiverId: 'all';			
}

export interface HasPrivateSender{
	senderId: UserId;	
}
export interface HasServerSender{
	senderrId: SystemId;			
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
export interface MessageBase  {

	senderId: SenderId;          
	content: string;
};

export interface MessagePrivate extends MessageBase{
	type: 'PrivateMsg';
	senderId: UserId; 	 //override MessageBase: must be a real user
	receiverId: UserId;  
}
export interface MessagePublic extends MessageBase{
	type: 'PublicMsg';
	senderId: UserId;   
	receiverId: 'all';  
}
export interface MessagePrivateGameInvite extends MessageBase{
	type: 'PrivateGameInviteMsg';
	senderId: UserId;   
	receiverId: UserId;  
}
export interface MessageTournament extends MessageBase{
	type: 'TournamentMsg';
	senderId: SystemId;   
	receiverId: 'all';  
}
