"use client";

import { useState } from "react";
import { createStripeSession } from "@/services/stripeService";
import { useAuthStore } from "@/store/authStore";

type StripePaymentModalProps = {
  onClose: () => void;
};

const CREDIT_OPTIONS = [5, 10, 20, 50, 100];

export default function StripePaymentModal({
  onClose,
}: StripePaymentModalProps) {
  const { accessToken } = useAuthStore();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!selectedAmount || !accessToken) {
      setError("Debes seleccionar una cantidad de créditos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createStripeSession(selectedAmount, accessToken);
      window.location.href = res.checkout_url; // redirige a Stripe Checkout
    } catch (err: any) {
      console.error("Stripe error:", err);
      setError("Hubo un error al iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          💳 Recargar Créditos
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {CREDIT_OPTIONS.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`px-4 py-2 rounded border ${
                selectedAmount === amount
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white"
              } hover:bg-blue-500 hover:text-white transition`}
            >
              {amount} créditos – ${amount}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 rounded-xl text-lg font-semibold shadow-md text-white
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
    hover:brightness-110 hover:shadow-lg transition-all duration-300
    disabled:opacity-50"
        >
          {loading ? "Redirigiendo a Stripe..." : "Pagar con Stripe"}
        </button>

        <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">
          Serás redirigido a Stripe para completar el pago.
        </p>
      </div>
    </div>
  );
}
