import { UserPayload } from 'src/domain/entities';

export interface IAuthService {
  validateUser(username: string, password: string): Promise<any>;
  login(user: UserPayload): Promise<string>;
}
