/* 
Declined DTO suggestion.

(Alena) I created the data types in types/types.ts at the start of the project 
and use them everywhere — also in the routes. I don’t add interfaces or DTOs 
because in TypeScript you don’t really need both; types and interfaces do 
the same job, it’s just about being consistent. Keeping everything in types.ts 
makes things cleaner and still fully type-safe.
*/

        /* (Luis) Suggestion to improve the profile method with DTOs
        so everytime we change the DTO, we will be forced to change this method
        to ensure consistency between class and DTOs. Let me know what you think.
        toBasicDTO(): UserBasicProfileDTO {
            return {
                name: this.name,
                id: this.id
            };
        }

        */ 


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
