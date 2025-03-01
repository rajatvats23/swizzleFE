export interface AuthResponse {
    access_token: string;
    refresh_token: string;
  }
  
  export interface TokenPayload {
    exp: number;
    user_id: string;
    email: string;
  }