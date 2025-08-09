import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserFromToken } from "@/utils/token";
import { useCreditStore } from "@/store/creditStore";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  setAuth: (token: string) => Promise<void>; // ⬅️ CHANGED: ahora async
  logout: () => Promise<void>; // ⬅️ CHANGED: ahora async
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      user: null,

      // ⬇️ CHANGED: ahora async y setea cookie httpOnly en el server
      setAuth: async (token) => {
        const user = getUserFromToken(token);

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }

        set({ accessToken: token, user });

        // ⬇️ NEW: informar al server para que cree el cookie "accessToken"
        try {
          await fetch("/api/auth/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }), // ⬅️ acá mando la variable "token"
          });
        } catch (e) {
          console.error("Failed to set cookie:", e);
        }

        // Traer créditos (como ya lo hacías)
        useCreditStore.getState().fetchCredits(token);
      },

      // ⬇️ CHANGED: ahora async y limpia cookie httpOnly
      logout: async () => {
        set({ accessToken: null, user: null });

        // 🔸 Resetear créditos
        useCreditStore.getState().resetCredits();

        // ⬇️ NEW: avisar al server para borrar el cookie
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
