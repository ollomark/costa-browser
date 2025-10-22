import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface AdminSession {
  username: string;
  loginTime: number;
  expiresAt: number;
}

export function useAdminAuth() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const sessionStr = localStorage.getItem('admin-session');
    
    if (!sessionStr) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const session: AdminSession = JSON.parse(sessionStr);
      
      // Check if session expired
      if (Date.now() > session.expiresAt) {
        logout();
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      logout();
    }
    
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('admin-session');
    setIsAuthenticated(false);
    setLocation('/admin/login');
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  };

  return {
    isAuthenticated,
    loading,
    logout,
    requireAuth,
  };
}

