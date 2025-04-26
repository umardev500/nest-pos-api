import { Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TokenClaims } from 'src/domain/entities';
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl';

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly cls: ClsService,
  ) {}

  /**
   * Retrieves the current user based on the JWT claims.
   * @returns {Promise<User>} The user if found.
   * @throws {NotFoundException} If no user is found.
   */
  async getMe() {
    const claims = this.cls.get<TokenClaims>('claims');

    const user = await this.userRepository.findById({
      id: claims.sub,
      merchant_id: claims.merchantId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
