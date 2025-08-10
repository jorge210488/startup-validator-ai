import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserFromToken } from "@/utils/token";
import { useCreditStore } from "@/store/creditStore";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  setAuth: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      user: null,

      setAuth: async (token) => {
        const user = getUserFromToken(token);

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }

        set({ accessToken: token, user });

        try {
          await fetch("/api/auth/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        } catch (e) {
          console.error("Failed to set cookie:", e);
        }

        useCreditStore.getState().fetchCredits(token);
      },

      logout: async () => {
        set({ accessToken: null, user: null });

        useCreditStore.getState().resetCredits();

        try {
          await fetch("/api/auth/clear-cookie", { method: "POST" });
        } catch (e) {
          console.error("Failed to clear cookie:", e);
        }

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("accessToken");
          window.location.href = "/";
        }
      },
    }),
    { name: "auth-storage" }
  )
);
