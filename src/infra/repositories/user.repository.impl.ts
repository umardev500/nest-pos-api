import { Injectable } from '@nestjs/common';
import { User } from 'prisma/generated';
import { IUserRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
