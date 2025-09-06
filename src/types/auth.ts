export type UserRole = 'O2 Admin' | 'Partner Admin' | 'O2 Super Admin' | 'O2 Partner Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}