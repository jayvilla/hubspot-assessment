export interface Conversation {
  avatar: string;
  firstName: string;
  lastName: string;
  mostRecentMessage: {
    content: string;
    timestamp: number;
    userId: number
  },
  totalMessages: number;
  userId: number;
}