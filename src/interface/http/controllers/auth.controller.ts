import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/app/dto';
import { AuthUseCase } from 'src/app/usecase';

@Controller('auth')
export class AuthController {
  // Inject the AuthUseCase to handle authentication logic
  constructor(private readonly authUsecase: AuthUseCase) {}

  /**
   * Handle user login
   * @param body - Contains email and password from client
   * @returns JWT access token if credentials are valid
   */
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    // Validate user's credentials (throws exception if invalid)
    const user = await this.authUsecase.validateUser(email, password);

    // Generate and return JWT token for authenticated user
    return this.authUsecase.login(user);
  }
}
