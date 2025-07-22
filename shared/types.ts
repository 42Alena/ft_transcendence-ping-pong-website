export interface User {
  id: number;
  username: string;
  avatarUrl: string;
  status: 'online' | 'offline' | 'in-game';
}

export interface Match {
  id: number;
  player1: User;
  player2: User;
  score1: number;
  score2: number;
  timestamp: string;
}

export interface ChatMessage {
  senderId: number;
  receiverId: number | null; // null = public
  content: string;
  sentAt: string;
}
