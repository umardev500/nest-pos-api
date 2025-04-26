import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // For password hashing and comparison
import { User } from 'prisma/generated'; // Prisma User model
import { InvalidCredentialsException } from 'src/common/exceptions'; // Custom exception for invalid credentials
import { TokenClaims } from 'src/domain/entities'; // Token payload structure
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl'; // User repository

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly jwtService: JwtService, // Service to create JWT tokens
    private readonly userRepository: UserRepositoryImpl, // Repository to fetch user data
  ) {}

  /**
   * Checks if the user's email and password are correct
   * @param email - User's email
   * @param password - User's password
   * @returns User - If credentials are valid, returns the user object
   * @throws InvalidCredentialsException - If credentials are invalid
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException(); // User not found
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new InvalidCredentialsException(); // Invalid password
    }

    return user; // Credentials valid, return user data
  }

  /**
   * Logs in the user and generates a JWT token
   * @param user - The user to log in
   * @returns { access_token: string } - The JWT token
   */
  login(user: User): { access_token: string } {
    const payload: TokenClaims = {
      email: user.email,
      sub: user.id, // User ID as subject
      merchantId: user.merchant_id, // Merchant ID associated with the user
    };

    return {
      access_token: this.jwtService.sign(payload), // Generate and return the JWT token
    };
  }
}
