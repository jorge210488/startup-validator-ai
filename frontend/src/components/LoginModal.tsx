"use client";

import { useState } from "react";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(username, password);
      const { access, refresh } = res.data;

      // Guardar tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Actualizar el estado global (decodifica el user internamente)
      setAuth(access);

      onClose(); // cerrar modal
    } catch (err: any) {
      setError("Usuario o contraseña inválidos.");
      console.error("Login error:", err.response?.data || err.message);
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
          🚀 Iniciar sesión
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-400"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 transition"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2">
          <button
            className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/dj-rest-auth/google/login/`)
            }
          >
            🔵 Iniciar con Google
          </button>

          <button
            className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/dj-rest-auth/linkedin_oauth2/login/`)
            }
          >
            💼 Iniciar con LinkedIn
          </button>
        </div>

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
