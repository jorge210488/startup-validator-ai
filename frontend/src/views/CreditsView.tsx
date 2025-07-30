"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMyCreditTransactions } from "@/services/creditsService";
import CreditTransactionItem from "@/components/CreditTransactionItem";
import Link from "next/link";
import { useCreditStore } from "@/store/creditStore";
import StripePaymentModal from "@/components/StripePaymentModal";

interface Transaction {
  amount: number;
  reason: string;
  created_at: string;
}

interface User {
  credits: number;
}

export default function CreditsView() {
  const { accessToken } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { credits } = useCreditStore();
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    getMyCreditTransactions(accessToken)
      .then((data) => setTransactions(data))
      .catch((err) => console.error("❌ Error al obtener transacciones:", err))
      .finally(() => setLoading(false)); // ← Esto faltaba
  }, [accessToken]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full md:pb-0 pb-20 relative text-gray-900 dark:text-white pt-40 md:pt-12">
      {/* Fondo Desktop */}
      <div className="hidden sm:block absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-o3.png" : "/fondo3.jpg"}
          alt="Fondo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Fondo Móvil */}
      <div className="block sm:hidden absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-m3.png" : "/fondo-s-m3.png"}
          alt="Fondo mobile"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 flex-grow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Mis Créditos</h1>

        {/* 🟢 Bloque de resumen */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10">
          <div
            className="px-6 py-3 rounded-xl text-lg font-semibold shadow-md text-white
  bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600
  dark:from-emerald-500 dark:via-teal-600 dark:to-cyan-700
"
          >
            Créditos disponibles: {credits}
          </div>

          <button
            onClick={() => setShowStripeModal(true)}
            className="px-6 py-3 rounded-xl text-lg font-semibold shadow-md text-white
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
    hover:brightness-110 hover:shadow-lg transition-all duration-300"
          >
            ➕ Recargar créditos
          </button>
        </div>

        {loading ? (
          <p className="text-lg">Cargando transacciones...</p>
        ) : transactions.length === 0 ? (
          <p className="text-lg">Aún no tienes transacciones.</p>
        ) : (
          <div className="w-full max-w-3xl pb-12">
            {transactions.map((tx, index) => (
              <CreditTransactionItem key={index} {...tx} />
            ))}
          </div>
        )}
      </main>
      {showStripeModal && (
        <StripePaymentModal onClose={() => setShowStripeModal(false)} />
      )}
    </div>
  );
}
