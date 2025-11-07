export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  confirmPassword?: string;
  description?: string;
  avatarUrl?: string;
}

export interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
