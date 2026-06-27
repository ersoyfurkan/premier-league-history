export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthPayload {
  userId: number;
  email: string;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
