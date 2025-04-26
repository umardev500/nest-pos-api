import { Module } from '@nestjs/common';
import { UserUseCase } from 'src/app/usecase';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl';
import { UserController } from 'src/interface/http/controllers';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserUseCase, UserRepositoryImpl],
  imports: [],
})
export class UserModule {}
