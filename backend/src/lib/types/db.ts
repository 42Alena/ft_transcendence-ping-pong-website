import { AvatarUrl, DisplayName, Message, MessageChat, Meta, PasswordHash, ReceiverId, SenderId, TimeSec, User, UserId, Username } from "../types/domain";


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
export type ChatDbRow = {
	id: MessageId;
	type: MessageChat;
	senderId: SenderId;
	receiverId: ReceiverId;
	content: Message;
	meta: Meta;
	createdAt: TimeSec;
};


