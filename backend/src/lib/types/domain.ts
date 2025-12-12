// DOMAIN = use FOR BACKEND ONLY
/* 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
INFO: this types can be used for all project

Add as header at the top of the file:
import *  from '../types/UserTypes';

or what you  special need:

import { UserId, UserStatus, MatchResult } from './types/types';
*/




//_____________ CONSTANTS__________________
export const SYSTEM_ID = "TOURNAMENT" as const;
export const GUEST_ID = "GUEST" as const;
export const AI_ID = "AI" as const;

//_____________CONSTANTS_ GDPR: delete/anonymize user account
export const DELETED_USER_DISPLAY_NAME = "Deleted user" as const;
export const DELETED_USERNAME = "Deleted_" as const;
export const DELETED_AVATARURL = null;
// export type DeletedUser = null;
// export type UserOrDeleted = User | DeletedUser;


export const TOURNAMENT_AI_ALIASES = [
	'AI_ALENA',
	'AI_SVEVA',
	'AI_LUIS',
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
	SYSTEM_ID,
	GUEST_ID,
	AI_ID,
	DELETED_USER_DISPLAY_NAME,  // Deleted_
	DELETED_USERNAME,
	...TOURNAMENT_AI_ALIASES,
];
export const RESERVED = RESERVED_NAMES;

// const newObj = Object.assign({}, baseObject, { new: prop })
// const newObj = { ...baseObject, ...{new: prop}}




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
	| { ok: false; reason: "self" | "not_found"  };  // allowed to add friend even if blocked
	// | { ok: false; reason: "self" | "not_found" | "blocked" };


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

export type SystemId = typeof SYSTEM_ID;

export type MessageContent = string;
export type MessageId = number;



// JSON: { "sender":"abc", "message": "hello", ... } or null
// export type Meta =
// 	| null  //for game invite and priate message
// 	| MetaTournamentNextMatch;

export type ReceiverDisplayname = DisplayName;

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

// export type NewMessageChat = Omit<MessageChat, "id" | "createdAt">;
export type NewMessageChat = NewMessageTypeChat;


//normal private DM: no meta
export type NewPrivateMessage = {
	type: "PrivateMessage";
	senderId: PrivateSenderId;
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
		| "no_receiver"
	};


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


//__________________GAME: MATCH TOURNAMENT______________

export type TournamentAiAlias = typeof TOURNAMENT_AI_ALIASES[number];

export type GameId = number;
export type GameMode = 'tournament' | 'normalGame';

export type Alias = string;

export type TournamentRound =
	| 'semi'
	| 'final';

export type GameTournamentRound =
	| TournamentRound
	| null;  //for normallGame

export type PlayerId = UserId | null;  // null for guest, AI
export type GameScore = number;


export type GameWinnersLosers = {
	winnerScore: GameScore;
	loserScore: GameScore;

	winnerAlias: Alias;
	loserAlias: Alias;
}

export type BaseGame = GameWinnersLosers & {

	mode: GameMode;  // "tournament" | "normalGame"
	tournamentRound: GameTournamentRound;

	winnerUserId: PlayerId;
	loserUserId: PlayerId;
	createdAt: TimeSec;
}

export type NormalGame = BaseGame & {
	mode: 'normalGame';
	tournamentRound: null;
}

export type TournamentGame = BaseGame & {
	mode: 'tournament';
	tournamentRound: TournamentRound;
}


export type AnyGame =
	| NormalGame
	| TournamentGame;


export type SaveGameResult =
	| { ok: true; saved: true }
	| { ok: true; saved: false }  // valid game, but skipped (AI vs AI or guest vs guest)
	| {
		ok: false;
		reason:
		| "not_me"             // not authenticated
		| "invalid_tournament" // bad mode/round combination
		| "invalid_game"       // structural problem, e.g. same winner/loser, empty alias
		| "invalid_score";     // winnerScore/loserScore invalid
	};


export type GamePlayersScores = {
			player1Alias: Alias,
			player1Score:GameScore,
			player2Alias: Alias,
			player2Score: GameScore
};


// one row in Sveva's "Matches" table on the profile page
export type UserProfileMatchRow = {
	opponentAlias: Alias;   // othermdisplayName,/ AI/guest alias
	date: string;			// 08/12/25
	scoreMeOther: string;        //  "3-0" my first
};

// whole history for that profile
export type UserProfileMatches = UserProfileMatchRow[];


export type GetUserProfileGamesAndStatsResult = {
	ok: true;
	matches: UserProfileMatchRow[];   // your rows with opponent/date/score
	stats: UserProfileStats;        // for 1./2/3. places total wins
} | {
	ok: false;
	reason: "not_me" | "no_user" ;
}


export type UserProfileStats = {
	totalGames: number;

	wins: number;
	losses: number;
	winRatePercent: number;   // 0–100
	lossRatePercent: number;  // 0–100 (or derive on frontend)

	place1: number;           // how many times 1st place
	place2: number;           // how many times 2nd place
	place3: number;           // how many times 3rd place
};

