import { AvatarUrl, DisplayName, MessageTypeChat, MessageContent, MessageId,  PasswordHash,  SenderId, TimeSec,  UserId, Username, PrivateReceiverId, GameMode, GameTournamentRound, PlayerId, GameScore, Alias, GameId } from "../types/domain";


export type JsonText = string;       // plain JSON string
export type MetaDb = JsonText | null;


//________________DB ROW: USER __________________
//types in db row users
export type UserDbRow = {
	id: UserId;
	username: Username;
	displayName: DisplayName;
	passwordHash: PasswordHash;
	avatarUrl: AvatarUrl;
	lastSeenAt: TimeSec;
	deletedAt: TimeSec;
};



//________________DB ROW: MESSAGES __________________
//types in db row chat
export type MessageDbRow = {
	id: MessageId;
	type: MessageTypeChat;
	senderId: SenderId;
	receiverId: PrivateReceiverId;
	content: MessageContent;
	// meta: MetaDb;
	createdAt: TimeSec;
};

export type MessageDbInsertRow = Omit<MessageDbRow, 'id' | 'createdAt'>;
export type MessageDbRowSenderReceiver = Pick<MessageDbRow, "senderId" | "receiverId">;


//________________DB ROW: GAMES __________________

export type GameDbRow = {

	id: GameId;
	mode: GameMode;
	tournamentRound:  GameTournamentRound;

	winnerUserId: PlayerId;
	loserUserId: PlayerId;
	
	winnerScore: GameScore;
	loserScore: GameScore;

	winnerAlias: Alias;            
	loserAlias: Alias;  

	createdAt: TimeSec;
}

export type GameDbInsertRow = Omit<GameDbRow, 'id' | 'createdAt'>;