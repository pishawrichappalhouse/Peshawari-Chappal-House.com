import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (email: string, password: string, username: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'aiwithqammar@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email?: string, password?: string) => {
    setLoading(true);
    try {
      // Mock login logic
      if (email && password) {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userData } = foundUser;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (email === ADMIN_EMAIL && password === 'admin123') {
          // Default admin login
          const adminUser: User = {
            email: ADMIN_EMAIL,
            username: 'Admin',
            role: 'admin',
            phone: '0000000000'
          };
          setUser(adminUser);
          localStorage.setItem('user', JSON.stringify(adminUser));
        } else {
          throw new Error('Invalid email or password');
        }
      } else {
        // Mock Google Login
        const googleUser: User = {
          email: 'google-user@example.com',
          username: 'Google User',
          role: 'user'
        };
        setUser(googleUser);
        localStorage.setItem('user', JSON.stringify(googleUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string, phone: string) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        email,
        username,
        phone,
        role: email === ADMIN_EMAIL ? 'admin' : 'user'
      };

      users.push({ ...newUser, password });
      localStorage.setItem('mock_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
