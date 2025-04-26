import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthUseCase } from 'src/app/usecase';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl';
import { AuthController } from 'src/interface/http/controllers';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthUseCase, UserRepositoryImpl, PrismaService],
})
export class AuthModule {}
