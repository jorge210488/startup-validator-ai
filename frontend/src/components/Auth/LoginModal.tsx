// src/components/LoginModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, socialLoginGoogle } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useGoogleLogin } from "@react-oauth/google";

type LoginModalProps = {
  onClose: () => void;
  onOpenRegister: () => void;
  redirectTo?: string;
};

export default function LoginModal({
  onClose,
  onOpenRegister,
  redirectTo,
}: LoginModalProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const finishLogin = async (access: string, refresh?: string) => {
    console.log(
      "[finishLogin] access.length:",
      access?.length,
      "has refresh?",
      !!refresh
    );
    localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
    await Promise.resolve(setAuth(access));
    onClose();
    router.replace(redirectTo || "/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      console.log("[handleLogin] username:", username);
      const res = await login(username, password);
      console.log("[handleLogin] backend res.data:", res.data);
      const { access, refresh } = res.data;
      await finishLogin(access, refresh);
    } catch (err: any) {
      console.error(
        "[handleLogin] error:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
      setError("Usuario o contraseña inválidos.");
    }
  };

  // ---------- GOOGLE: Implicit Flow (access_token) ----------
  const googleAuth = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (resp) => {
      try {
        const accessToken = resp?.access_token;
        if (!accessToken) {
          setError("No se recibió access_token de Google.");
          return;
        }
        console.log("[googleAuth] access_token length:", accessToken.length);

        // Enviar access_token al backend
        const res = await socialLoginGoogle(accessToken, false);
        console.log("[googleAuth] backend res.data:", res.data);

        const { access, refresh } = res.data;
        await finishLogin(access, refresh);
      } catch (e: any) {
        console.error(
          "[googleAuth] backend error:",
          e?.response?.status,
          e?.response?.data || e?.message
        );
        setError(
          e?.response?.data?.non_field_errors?.[0] ||
            e?.response?.data?.detail ||
            "No se pudo iniciar sesión con Google."
        );
      }
    },
    onError: () => {
      console.error("[googleAuth] onError");
      setError("Error con Google. Intenta de nuevo.");
    },
  });
  // -------------------------------------------------------

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
          aria-label="Cerrar"
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
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
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
            type="button"
            className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => {
              console.log("[UI] Google button clicked");
              googleAuth();
            }}
          >
            🔵 Iniciar con Google
          </button>

          <button
            className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => alert("Próximamente LinkedIn")}
          >
            💼 Iniciar con LinkedIn
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
