import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenClaims } from 'src/domain/entities';

@Injectable()
export class AuthUseCase {
  constructor(private readonly jwtService: JwtService) {}

  validateUser(username: string, password: string) {
    if (username === 'admin' && password === 'admin') {
      return { id: 1, username };
    }
    return null;
  }

  login(user: any) {
    const payload: TokenClaims = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
