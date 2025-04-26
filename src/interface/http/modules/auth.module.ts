import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthUseCase } from 'src/app/usecase';
import { AuthController } from 'src/interface/http/controllers';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [AuthUseCase],
})
export class AuthModule {}
