import { User } from 'prisma/generated';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}
