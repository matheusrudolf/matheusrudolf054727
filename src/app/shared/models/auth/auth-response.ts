export interface AuthResponse {
    accessToken: string;
    token_type: string;
    expireIn: number;
    refreshToken?: string;
    message?: string;
}
