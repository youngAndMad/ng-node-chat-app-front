import { User } from 'src/app/common/model/user';
import { TokenDto } from './token.dto';

export type LoginResponse = {
  user: User;
  tokens: TokenDto;
};
