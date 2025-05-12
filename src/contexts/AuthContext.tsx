
import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api";

// Define User type based on your MongoDB structure
interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  uid?: string; // Adding uid as optional property for backward compatibility
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setCurrentUser(user);
        
        // Check if user is admin
        if (user && user.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  async function signup(email: string, password: string) {
    try {
      const response = await authApi.signup(email, password);
      
      // Store auth token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      // Set user in state
      setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await authApi.login(email, password);
      
      // Store auth token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      // Set user in state
      setCurrentUser(response.user);
      
      // Check if user is admin
      if (response.user && response.user.role === 'admin') {
        setIsAdmin(true);
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state regardless of API response
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }

  const value = {
    currentUser,
    isAdmin,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
