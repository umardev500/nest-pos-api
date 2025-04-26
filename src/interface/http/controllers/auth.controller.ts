import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/app/dto';
import { AuthUseCase } from 'src/app/usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUsecase: AuthUseCase) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authUsecase.validateUser(email, password);

    return this.authUsecase.login(user);
  }
}
