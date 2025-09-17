import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (args: { email: string; password: string }) => Promise<{ user: User; role: string }>;
  register: (args: { name: string; email: string; password: string; role?: string }) => Promise<{ user: User; role: string }>;
  logout: () => void;
  clearError: () => void;
  validateToken: () => Promise<boolean>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data?.error || "Login failed");
          }
          const userData = data.user ?? null;
          const roleData = data.role ?? null;
          
          set({ 
            token: data.token ?? null, 
            user: userData,
            role: roleData, 
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { user: userData, role: roleData };
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || "Login failed",
            isAuthenticated: false 
          });
          throw error;
        }
      },
      register: async ({ name, email, password, role = 'user' }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data?.error || "Registration failed");
          }
          const userData = data.user ?? null;
          const roleData = data.role ?? null;
          
          set({ 
            token: data.token ?? null, 
            user: userData,
            role: roleData, 
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { user: userData, role: roleData };
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || "Registration failed",
            isAuthenticated: false 
          });
          throw error;
        }
      },
      logout: () => set({ 
        token: null, 
        user: null,
        role: null, 
        isAuthenticated: false,
        error: null 
      }),
      clearError: () => set({ error: null }),
      validateToken: async () => {
        const { token } = get();
        if (!token) return false;
        
        try {
          const response = await fetch("http://localhost:5000/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.ok;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        role: state.role, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuth;

