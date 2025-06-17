"use client";

import { useState } from "react";

// ✅ Aquí declaras la prop que espera el componente
type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes hacer la lógica real con axios
    alert("Intentando iniciar sesión...");
    // onClose(); // podrías cerrarlo aquí si quieres tras login exitoso
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
          🚀 Iniciar sesión
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
