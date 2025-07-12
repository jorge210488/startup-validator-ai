"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import DarkModeToggle from "./DarkModeToggle";
import { useCreditStore } from "@/store/creditStore";

export default function Navbar() {
  const { user, logout, accessToken } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { credits } = useCreditStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 shadow bg-white dark:bg-gray-900 dark:text-white transition-colors">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            <span className="mr-2">🚀</span> Startup Validator AI
          </Link>

          {accessToken && (
            <>
              <Link
                href="/ideas"
                className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-lg"
              >
                Mis ideas
              </Link>
              <Link
                href="/credits"
                className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-lg"
              >
                🪙 Ver transacciones
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {accessToken && (
            <div className="text-base sm:text-lg font-bold">
              {user?.email && <span>{user.email}</span>} · {credits ?? 0}{" "}
              créditos
            </div>
          )}

          <DarkModeToggle />

          {!accessToken ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                🔐 Iniciar sesión
              </button>
              <button
                onClick={() => setShowRegisterModal(true)} // 👈 Nuevo
                className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
              >
                ✨ Registrarse
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onOpenRegister={() => {
            setShowLoginModal(false); // cerrar login
            setShowRegisterModal(true); // abrir register
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onOpenLogin={() => {
            setShowRegisterModal(false); // cerrar register
            setShowLoginModal(true); // abrir login
          }}
        />
      )}
    </>
  );
}
