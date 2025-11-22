import { AvatarUrl, DisplayName, MessageChat, MessageContent, MessageId, Meta, PasswordHash, ReceiverId, SenderId, TimeSec,  UserId, Username } from "../types/domain";


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
	type: MessageChat;
	senderId: SenderId;
	receiverId: ReceiverId;
	content: MessageContent;
	meta: Meta;
	createdAt: TimeSec;
};

export type MessageDbInsertRow = Omit<MessageDbRow, 'id' | 'createdAt'>;


