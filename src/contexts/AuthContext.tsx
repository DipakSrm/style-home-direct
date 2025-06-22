
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email && password) {
      const user = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe'
      };
      setState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    // Simulate API call
    if (email && password && firstName && lastName) {
      const user = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName
      };
      setState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    setState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
