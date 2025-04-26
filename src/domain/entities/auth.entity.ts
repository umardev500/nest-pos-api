export class TokenClaims {
  sub: number;
  email: string;
  merchant_id: number;
}

export class JwtPayload extends TokenClaims {
  iat: number;
  exp: number;
}
