import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt for hashing and comparing passwords
import { User } from 'prisma/generated'; // Import User model from Prisma schema
import { InvalidCredentialsException } from 'src/common/exceptions'; // Import custom exception for invalid credentials
import { TokenClaims } from 'src/domain/entities'; // Import the TokenClaims type for payload structure
import { UserRepositoryImpl } from 'src/infra/repositories/user.repository.impl'; // Import user repository implementation

@Injectable()
export class AuthUseCase {
  constructor(
    private readonly jwtService: JwtService, // JWT service for generating tokens
    private readonly userRepository: UserRepositoryImpl, // User repository for database operations
  ) {}

  /**
   * Validate user credentials (email and password)
   * @param email - The email address of the user
   * @param password - The password to validate
   * @returns User - Returns user data if credentials are valid
   * @throws InvalidCredentialsException - Throws exception if credentials are invalid
   */
  async validateUser(email: string, password: string): Promise<User> {
    // Find the user by email in the repository
    const user = await this.userRepository.findByEmail(email);

    // If no user found, throw invalid credentials exception
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Compare the provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If password doesn't match, throw invalid credentials exception
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    // If credentials are valid, return the user object
    return user;
  }

  /**
   * Generates a JWT token for a valid user
   * @param user - The user object to generate the token for
   * @returns { access_token: string } - Returns the JWT access token
   */
  login(user: User): { access_token: string } {
    // Define the payload for the JWT token
    const payload: TokenClaims = {
      email: user.email,
      sub: user.id, // User's ID as the subject of the token
      merchantId: user.merchant_id, // Merchant ID associated with the user
    };

    // Sign the payload and return the access token
    return {
      access_token: this.jwtService.sign(payload), // Create and return the JWT token
    };
  }
}
