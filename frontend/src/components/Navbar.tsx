"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import LoginModal from "./Auth/LoginModal";
import RegisterModal from "./Auth/RegisterModal";
import DarkModeToggle from "./Layout/DarkModeToggle";
import { useCreditStore } from "@/store/creditStore";
import UpdateUserModal from "./Auth/UpdateUserModal";

export default function Navbar() {
  const { user, logout, accessToken } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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
                  className="px-3 py-1.5 rounded-lg 
  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
  dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
  text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
  transition-all duration-300 text-base"
                >
                  💡Ideas
                </Link>
                <Link
                  href="/credits"
                  className="px-3 py-1.5 rounded-lg 
  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
  dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
  text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
  transition-all duration-300 text-base"
                >
                  🔄 Transacciones
                </Link>
                {user?.is_superuser && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg 
      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
      dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
      text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
      transition-all duration-300 text-base"
                  >
                    📊 Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* DERECHO EN MD+ / TODO EN MOVIL */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-4 md:justify-end">
            {/* SOLO EN MÓVIL Y LOGUEADO */}
            {accessToken && (
              <div className="flex flex-col items-center gap-4 md:hidden">
                {/* Links */}
                <div className="flex gap-4">
                  <Link
                    href="/ideas"
                    className="px-3 py-1.5 rounded-lg 
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
transition-all duration-300 text-base"
                  >
                    💡Ideas
                  </Link>
                  <Link
                    href="/credits"
                    className="px-3 py-1.5 rounded-lg 
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
transition-all duration-300 text-base"
                  >
                    🔄 Transacciones
                  </Link>
                  {user?.is_superuser && (
                    <Link
                      href="/admin"
                      className="px-3 py-1.5 rounded-lg 
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
transition-all duration-300 text-base"
                    >
                      📊 Dashboard
                    </Link>
                  )}
                </div>

                {/* Perfil + acciones en una sola fila */}
                <div className="flex items-center justify-center gap-6">
                  {/* Email y créditos */}
                  <div className="flex flex-col items-center text-center">
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="text-base font-bold text-black dark:text-white underline underline-offset-4 hover:opacity-80 transition"
                      aria-label="Abrir perfil"
                    >
                      {user?.email || "Perfil"}
                    </button>
                    <span className="text-sm font-bold text-black dark:text-white">
                      {credits ?? 0} créditos
                    </span>
                  </div>

                  {/* Tema */}
                  <DarkModeToggle />

                  {/* Cerrar sesión */}
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg 
bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 
dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 
text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
transition-all duration-300 text-base"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}

            {/* VISTA MD+ LOGUEADO */}
            {accessToken && (
              <div className="hidden md:flex items-center gap-4 text-base font-bold">
                <button
                  onClick={() => setShowUpdateModal(true)} // 👈 abre modal al tocar el email
                  className="text-black dark:text-white underline underline-offset-4 hover:opacity-80 transition"
                  aria-label="Abrir perfil"
                >
                  {user?.email || "Perfil"}
                </button>
                <span className="text-black dark:text-white">
                  · {credits ?? 0} créditos
                </span>
                <DarkModeToggle />
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg 
  bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 
  dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 
  text-white font-medium hover:brightness-110 shadow-md hover:shadow-lg 
  transition-all duration-300 text-base"
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

      {accessToken && (
        <UpdateUserModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  );
}
