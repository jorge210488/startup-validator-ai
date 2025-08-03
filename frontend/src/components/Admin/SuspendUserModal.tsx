"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { suspenderUsuario } from "@/services/userService";

type SuspendUserModalProps = {
  user: {
    id: number;
    username: string;
  };
  onClose: () => void;
};

export default function SuspendUserModal({
  user,
  onClose,
}: SuspendUserModalProps) {
  const { accessToken } = useAuthStore();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (!accessToken || !reason.trim()) {
      setError("Debes ingresar un motivo para la suspensión.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await suspenderUsuario(user.id, reason, accessToken);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("Error al suspender usuario:", err);
      setError("Hubo un error al suspender al usuario.");
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

        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          ⚠️ Suspender Usuario
        </h2>

        <p className="text-center mb-4">
          ¿Estás seguro de que deseas suspender a{" "}
          <span className="font-semibold text-red-500">{user.username}</span>?
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo de la suspensión..."
          className="w-full p-2 rounded border bg-gray-50 dark:bg-gray-900 text-sm mb-3 resize-none h-24"
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm text-center mb-2">
            ✅ Usuario suspendido con éxito
          </p>
        )}

        <button
          onClick={handleSuspend}
          disabled={loading}
          className="w-full py-3 rounded-xl text-lg font-semibold shadow-md text-white
            bg-gradient-to-r from-red-500 to-red-700
            hover:brightness-110 hover:shadow-lg transition-all duration-300
            disabled:opacity-50"
        >
          {loading ? "Suspendiendo..." : "Confirmar suspensión"}
        </button>
      </div>
    </div>
  );
}
