import { User } from 'src/app/common/model/user';
import { Message } from './message';

export type Chat = {
  id: number;
  messages: Message[];
  members: User[];
  createdTime: Date;
};
