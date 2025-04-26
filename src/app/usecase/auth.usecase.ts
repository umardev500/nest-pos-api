import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt
import { InvalidCredentialsException } from 'src/common/exceptions';
import { TokenClaims } from 'src/domain/entities';
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl';

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryImpl,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findByEmail(username);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  login(user: any) {
    const payload: TokenClaims = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
