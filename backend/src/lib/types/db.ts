import { AvatarUrl, DisplayName, MessageTypeChat, MessageContent, MessageId, Meta, PasswordHash, ReceiverId, SenderId, TimeSec,  UserId, Username } from "../types/domain";


export type JsonText = string;       // plain JSON string
export type MetaDb = JsonText | null;

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



//types in db row chat
export type MessageDbRow = {
	id: MessageId;
	type: MessageTypeChat;
	senderId: SenderId;
	receiverId: ReceiverId;
	content: MessageContent;
	// meta: MetaDb;
	createdAt: TimeSec;
};

export type MessageDbInsertRow = Omit<MessageDbRow, 'id' | 'createdAt'>;


