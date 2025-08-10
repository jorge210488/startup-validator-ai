import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getMe } from "@/services/creditsService";

interface CreditState {
  credits: number;
  fetchCredits: (token: string) => Promise<void>;
  setCredits: (value: number) => void;
  resetCredits: () => void;
}

export const useCreditStore = create(
  persist<CreditState>(
    (set) => ({
      credits: 0,

      fetchCredits: async (token: string) => {
        try {
          const user = await getMe(token);
          if (user?.credits !== undefined) {
            set({ credits: user.credits });
          }
        } catch (error) {
          console.error("❌ Error al obtener créditos:", error);
        }
      },

      setCredits: (value: number) => {
        set({ credits: value });
      },

      resetCredits: () => {
        set({ credits: 0 });
      },
    }),
    {
      name: "credit-storage",
    }
  )
);
