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
      <nav className="absolute top-1 left-0 w-full z-20 bg-transparent text-white dark:text-white transition-colors px-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          {/* FILA 1 - LOGO */}
          <div className="flex justify-center md:justify-start items-center gap-6 mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold">
              <span className="mr-2">🚀</span> Startup Validator AI
            </Link>

            {/* SOLO EN MD+ */}
            {accessToken && (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/ideas"
                  className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-lg"
                >
                  💡Mis ideas
                </Link>
                <Link
                  href="/credits"
                  className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-lg"
                >
                  🔄 Ver transacciones
                </Link>
              </div>
            )}
          </div>

          {/* DERECHO EN MD+ / TODO EN MOVIL */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-4 md:justify-end">
            {/* SOLO EN MÓVIL Y LOGUEADO */}
            {accessToken && (
              <div className="flex flex-col items-center gap-4 md:hidden">
                <div className="flex gap-4">
                  <Link
                    href="/ideas"
                    className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-lg"
                  >
                    💡Mis ideas
                  </Link>
                  <Link
                    href="/credits"
                    className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-lg"
                  >
                    🔄 Ver transacciones
                  </Link>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="text-base font-bold">
                    {user?.email && <span>{user.email}</span>} · {credits ?? 0}{" "}
                    créditos
                  </div>
                  <DarkModeToggle />
                  <button
                    onClick={logout}
                    className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            {/* VISTA MD+ LOGUEADO */}
            {accessToken && (
              <div className="hidden md:flex items-center gap-4 text-base font-bold">
                <div>
                  {user?.email && <span>{user.email}</span>} · {credits ?? 0}{" "}
                  créditos
                </div>
                <DarkModeToggle />
                <button
                  onClick={logout}
                  className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            )}

            {/* NO LOGUEADO - Móvil y MD */}
            {!accessToken && (
              <>
                {/* FILA 2 SOLO EN MÓVIL */}
                <div className="flex md:hidden justify-center">
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-4 py-2 rounded border border-blue-600 text-blue-600 dark:text-white hover:bg-blue-50 transition"
                    >
                      🔐 Iniciar sesión
                    </button>
                    <DarkModeToggle />
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="px-4 py-2 rounded border border-blue-600 text-blue-600 dark:text-white hover:bg-blue-50 transition"
                    >
                      ✨ Registrarse
                    </button>
                  </div>
                </div>

                {/* EN MD+ EN UNA SOLA FILA */}
                <div className="hidden md:flex items-center gap-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 rounded border border-blue-600 text-blue-600 dark:text-white hover:bg-blue-50 transition"
                  >
                    🔐 Iniciar sesión
                  </button>
                  <DarkModeToggle />
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 rounded border border-blue-600 text-blue-600 dark:text-white hover:bg-blue-50 transition"
                  >
                    ✨ Registrarse
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onOpenRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onOpenLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
}
