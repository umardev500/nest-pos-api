import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/app/dto';
import { AuthUseCase } from 'src/app/usecase';

@Controller('auth')
export class AuthController {
  // Inject AuthUseCase to handle authentication logic
  constructor(private readonly authUsecase: AuthUseCase) {}

  /**
   * Handles the login process
   * @param body - Contains email and password from the client
   * @returns JWT token if credentials are valid
   */
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    // Validate credentials, throws if invalid
    const user = await this.authUsecase.validateUser(email, password);

    // Generate and return JWT token for the authenticated user
    return this.authUsecase.login(user);
  }
}
