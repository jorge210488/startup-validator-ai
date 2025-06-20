// ✅ /store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserFromToken } from "@/utils/token";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (token) => {
        const user = getUserFromToken(token);
        set({ accessToken: token, user });
      },
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
