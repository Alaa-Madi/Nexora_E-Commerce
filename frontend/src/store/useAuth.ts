import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (args: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthenticated: false,
      login: async ({ email, password }) => {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Login failed");
        }
        set({ token: data.token ?? null, role: data.role ?? null, isAuthenticated: true });
      },
      logout: () => set({ token: null, role: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ token: state.token, role: state.role, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuth;

