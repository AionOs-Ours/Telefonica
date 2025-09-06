import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, User, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  'O2 Admin': {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@o2.com',
    role: 'O2 Admin',
    companyName: 'O2 Business Solutions'
  },
  'Partner Admin': {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@techpartner.com',
    role: 'Partner Admin',
    companyName: 'TechPartner Solutions'
  },
  'O2 Super Admin': {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.williams@o2.com',
    role: 'O2 Super Admin',
    companyName: 'O2 Business Solutions'
  },
  'O2 Partner Manager': {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.rodriguez@o2.com',
    role: 'O2 Partner Manager',
    companyName: 'O2 Business Solutions'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}