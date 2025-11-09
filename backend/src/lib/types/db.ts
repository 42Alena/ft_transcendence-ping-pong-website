import { AvatarUrl, DisplayName, PasswordHash, TimeSec, User, UserId, Username } from "../types/domain";


//types in db row
export type UserDbRow = {
	id: UserId;
	username: Username;
	displayName: DisplayName;
	passwordHash: PasswordHash;
	avatarUrl: AvatarUrl;
	lastSeenAt: TimeSec;
};