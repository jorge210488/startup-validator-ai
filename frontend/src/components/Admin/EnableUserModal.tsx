"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { habilitarUsuario } from "@/services/userService";
import type { AdminUser } from "@/views/AdminView";

type EnableUserModalProps = {
  user: AdminUser;
  onClose: () => void;
  onUserUpdate: (updatedUser: AdminUser) => void;
};

export default function EnableUserModal({
  user,
  onClose,
  onUserUpdate,
}: EnableUserModalProps) {
  const { accessToken } = useAuthStore();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    if (!accessToken) {
      setError("No se encontró el token de autenticación.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await habilitarUsuario(user.id, accessToken);
      setSuccess(true);
      onUserUpdate({ ...user, is_active: true });
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("Error al habilitar usuario:", err);
      setError("Hubo un error al habilitar al usuario.");
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

        <h2 className="text-2xl font-bold mb-4 text-center text-emerald-600">
          ✅ Habilitar Usuario
        </h2>

        <p className="text-center mb-6">
          ¿Estás seguro de que deseas habilitar a{" "}
          <span className="font-semibold text-emerald-500">
            {user.username}
          </span>
          ?
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm text-center mb-3">
            ✅ Usuario habilitado con éxito
          </p>
        )}

        <button
          onClick={handleEnable}
          disabled={loading}
          className="w-full py-3 rounded-xl text-lg font-semibold shadow-md text-white
            bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600
            dark:from-emerald-500 dark:via-teal-600 dark:to-cyan-700
            hover:brightness-110 hover:shadow-lg transition-all duration-300
            disabled:opacity-50"
        >
          {loading ? "Habilitando..." : "Confirmar habilitación"}
        </button>
      </div>
    </div>
  );
}
