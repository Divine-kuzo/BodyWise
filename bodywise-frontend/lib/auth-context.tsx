'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  role: 'patient' | 'health_professional' | 'institutional_admin' | 'system_admin';
  isVerified: boolean;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // verify token and get user info
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser({
            id: data.user.userId,
            email: data.user.email,
            role: data.user.role,
            isVerified: true,
            profile: data.user.profile,
          });
          setToken(authToken);
        }
      } else {
        // invalid token, clear it
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }

      // store token
      localStorage.setItem('token', data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`; // 1 day

      setToken(data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        isVerified: data.user.isVerified === 1,
      });

      console.log('User role:', data.user.role);

      // redirect based on role (best part)
      const redirectMap = {
        'system_admin': '/admin',
        'health_professional': '/doctor',
        'institutional_admin': '/institution',
        'patient': '/user',
      };

      const redirectPath = redirectMap[data.user.role as keyof typeof redirectMap] || '/';
      console.log('Redirecting to:', redirectPath);
      
      // Use window.location for a hard redirect to ensure middleware runs
      window.location.href = redirectPath;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie and log activity
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Clear client-side storage
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    setUser(null);
    setToken(null);
    
    // Hard redirect to login page to ensure clean state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
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
