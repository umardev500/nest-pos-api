import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'prisma/generated';
import { IUserRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a user by their email.
   * @param email The email of the user.
   * @returns {Promise<User | null>} The user if found, otherwise null.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Finds a user by a unique identifier (id, email, or other unique field).
   * @param where The unique identifier (can be { id, email, etc. }).
   * @returns {Promise<User | null>} The user if found, otherwise null.
   */
  async findById(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
    });
  }
}
