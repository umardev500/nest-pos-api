import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt
import { User } from 'prisma/generated';
import { InvalidCredentialsException } from 'src/common/exceptions';
import { TokenClaims } from 'src/domain/entities';
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl';

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryImpl,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  login(user: User) {
    const payload: TokenClaims = {
      email: user.email,
      sub: user.id,
      merchant_id: user.merchant_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
