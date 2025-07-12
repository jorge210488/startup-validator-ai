// app/(app)/credits/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMyCreditTransactions } from "@/services/creditsService";
import CreditTransactionItem from "@/components/CreditTransactionItem";

interface Transaction {
  amount: number;
  reason: string;
  created_at: string;
}

export default function CreditsView() {
  const { accessToken } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    getMyCreditTransactions(accessToken)
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener transacciones:", err);
        setLoading(false);
      });
  }, [accessToken]);

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full relative text-gray-900 dark:text-white px-6 py-10 items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        Historial de Créditos
      </h1>

      {loading ? (
        <p className="text-center">Cargando transacciones...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center text-lg">Aún no tienes transacciones.</p>
      ) : (
        <div className="w-full max-w-3xl">
          {transactions.map((tx, index) => (
            <CreditTransactionItem key={index} {...tx} />
          ))}
        </div>
      )}
    </div>
  );
}
