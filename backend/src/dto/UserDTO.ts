// DTO for database interactions
export interface UserDbDTO {
    id: string;
    username: string;
    passwordHash: string;
    avatarUrl?: string;
    userStatus: 'online' | 'offline' | 'away' | 'busy';
    isDeleted: number; // 0 or 1 (SQLite uses like that)
}

// DTO for API responses (what frontend receives)
export interface UserProfileDTO {
    id: string;
    username: string;
    avatarUrl?: string;
    userStatus: 'online' | 'offline' | 'away' | 'busy';
    friends: string[]; // Array of friends IDs
    wins: number;
    losses: number;
    matchHistory: MatchResultDTO[]; // Array of match results
}

// DTO for match results
export interface MatchResultDTO {
    opponentId: string;
    result: 'won' | 'lost';
}

// DTO for user registration
export interface CreateUserDTO {
    username: string;
    password: string; // Plain text password (will be hashed before storing)
    avatarUrl?: string;
}

// DTO for updating user profile
export interface UserSummaryDTO {
    id: string;
    username: string;
    avatarUrl?: string;
    userStatus: 'online' | 'offline';
}

// DTO for user basic profile
export interface UserBasicProfileDTO {
    name: string;
    id: string;
}

// DTO for match operation
export interface AddMatchDTO {
    opponentId: string;
    result: 'won' | 'lost';
}

// DTO for user status update
export interface UserStatusUpdateDTO {
    userStatus: 'online' | 'offline';
}
