export class TokenClaims {
  sub: number;
  email: string;
  merchantId: number;
}

export class JwtPayload extends TokenClaims {
  iat: number;
  exp: number;
}
