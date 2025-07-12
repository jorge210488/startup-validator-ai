import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserFromToken } from "@/utils/token";
import { useCreditStore } from "@/store/creditStore";

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
        localStorage.setItem("accessToken", token);
        set({ accessToken: token, user });

        // Traer créditos
        useCreditStore.getState().fetchCredits(token);
      },

      logout: () => {
        set({ accessToken: null, user: null });

        // 🔸 Resetear créditos
        useCreditStore.getState().resetCredits();

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("accessToken");
          window.location.href = "/";
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
