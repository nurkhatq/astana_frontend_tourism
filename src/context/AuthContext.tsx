import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiClient } from '../api/client';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { access: string; refresh: string }) => void;
  logout: () => void;
  updateProfile: (data: FormData | Partial<User>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);
  const updateAvatar = async (file: File) => {
    try {
      await authApi.updateAvatar(file);
      // Refetch user profile to get updated avatar URL
      await fetchUser();
    } catch (error) {
      throw error;
    }
  };
  const fetchUser = async () => {
    try {
      const response = await apiClient.get<User>('/users/profile/me/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (tokens: { access: string; refresh: string }) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };
  const updateProfile = async (data: FormData | Partial<User>) => {
    try {
      const response = await apiClient.patch<User>(
        '/users/profile/me/',
        data,
        {
          headers: {
            ...(data instanceof FormData
              ? { 'Content-Type': 'multipart/form-data' }
              : { 'Content-Type': 'application/json' }),
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateProfile,updateAvatar }}>
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