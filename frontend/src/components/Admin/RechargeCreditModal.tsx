"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { recargarCreditos } from "@/services/adminService";
import type { AdminUser } from "@/views/AdminView"; // Ajusta la ruta si es otra

type RechargeCreditModalProps = {
  user: AdminUser;
  onClose: () => void;
  onUserUpdate: (updatedUser: AdminUser) => void;
};

const CREDIT_OPTIONS = [5, 10, 20, 50, 100];

export default function RechargeCreditModal({
  user,
  onClose,
  onUserUpdate,
}: RechargeCreditModalProps) {
  const { accessToken } = useAuthStore();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!selectedAmount || !accessToken) {
      setError("Debes seleccionar una cantidad de créditos.");
      return;
    }

    if (!reason.trim()) {
      setError("Debes escribir un motivo para la recarga.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await recargarCreditos(
        user.id,
        selectedAmount,
        reason,
        accessToken
      );
      setSuccess(true);
      onUserUpdate({
        id: user.id,
        username: user.username,
        email: user.email,
        credits: response.new_credits,
        is_active: true,
      });

      setTimeout(onClose, 1500); // Cierra el modal después de un segundo y medio
    } catch (err: any) {
      console.error("Error al recargar créditos:", err);
      setError("Hubo un error al recargar créditos.");
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
          ➕ Recargar Créditos a{" "}
          <span className="text-blue-600">{user.username}</span>
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
              {amount} créditos
            </button>
          ))}
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo de la recarga..."
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900 text-sm mb-3 resize-none h-24"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm text-center mb-2">
            ✅ Créditos recargados con éxito
          </p>
        )}

        <button
          onClick={handleRecharge}
          disabled={loading}
          className="w-full py-3 rounded-xl text-lg font-semibold shadow-md text-white
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
            hover:brightness-110 hover:shadow-lg transition-all duration-300
            disabled:opacity-50"
        >
          {loading ? "Recargando..." : "Confirmar recarga"}
        </button>
      </div>
    </div>
  );
}
