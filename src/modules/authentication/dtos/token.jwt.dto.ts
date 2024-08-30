export class TokenJwtDto {
  token: string;
  expires_in: number;
  user_id: number;

  constructor(token: string, expiresIn: number, userId: number) {
    this.token = token;
    this.expires_in = expiresIn;
    this.user_id = userId;
  }
}
