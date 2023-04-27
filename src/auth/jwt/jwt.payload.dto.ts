import { UUID } from 'crypto';

export class JwtPayload {
  sub: UUID;
  iat?: number;
  exp?: number;
}
