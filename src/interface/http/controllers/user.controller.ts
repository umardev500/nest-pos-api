import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserUseCase } from 'src/app/usecase';
import { JwtAuthGuard } from 'src/interface/http/guards';

@Controller('users')
export class UserController {
  constructor(private readonly userUsecase: UserUseCase) {}

  /**
   * Endpoint to get the current authenticated user's details.
   * @returns {Promise<User>} The user data.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe() {
    return this.userUsecase.getMe();
  }
}
