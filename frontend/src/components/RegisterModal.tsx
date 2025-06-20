"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { register } from "@/services/authService";

type RegisterModalProps = {
  onClose: () => void;
  onOpenLogin: () => void; // ✅ nueva prop
};

export default function RegisterModal({
  onClose,
  onOpenLogin,
}: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password1 !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await register(username, email, password1, password2);
      const { access, refresh } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setAuth(access);
      onClose();
    } catch (err: any) {
      console.error("Register error:", err.response?.data || err.message);
      setError("Error al registrar usuario. Verifica los campos.");
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

        <h2 className="text-2xl font-bold mb-4 text-center">✨ Registro</h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="px-4 py-2 rounded border bg-gray-100 dark:bg-gray-900"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 rounded border bg-gray-100 dark:bg-gray-900"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
            className="px-4 py-2 rounded border bg-gray-100 dark:bg-gray-900"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="px-4 py-2 rounded border bg-gray-100 dark:bg-gray-900"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              onClose(); // cerrar register
              onOpenLogin(); // abrir login
            }}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}
