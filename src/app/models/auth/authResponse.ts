export class AuthResponse {
  success: boolean;
  token: string;
  message: string;
  user?: {
    id: string,
    firstName: string,
    lastName: string,
    username: string,
  }

  constructor(success: boolean, token: string, message: string) {
    this.success = success;
    this.token = token;
    this.message = message;
  }
}
