import { Prisma, User } from 'prisma/generated';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;

  findById(where: Prisma.UserWhereUniqueInput): Promise<User | null>;
}
