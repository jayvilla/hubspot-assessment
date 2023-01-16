import { Message } from "./messages.interface";
import { User } from "./user.interface";

export interface MessageData {
  messages: Message[],
  userId: number;
  users: User[];
}