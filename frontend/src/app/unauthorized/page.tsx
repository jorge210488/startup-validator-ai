"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import LoginModal from "@/components/Auth/LoginModal";

export default function UnauthorizedPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const { accessToken } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (!isMounted) return null;

  const isLoggedIn = Boolean(accessToken);

  return (
    <div className="flex flex-col flex-grow min-h-screen w-full relative text-gray-900 dark:text-white pt-40 md:pt-12">
      {/* Fondo desktop */}
      <div className="hidden sm:block absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-o3.png" : "/fondo3.jpg"}
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      {/* Fondo mobile */}
      <div className="block sm:hidden absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-m3.png" : "/fondo-s-m3.png"}
          alt="Background mobile"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 flex-grow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Acceso no autorizado
        </h1>
        <p className="opacity-90 max-w-xl mb-8">
          {isLoggedIn
            ? "Tu cuenta no tiene permisos para acceder a esta sección."
            : "Necesitas iniciar sesión para continuar."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-lg text-white bg-gradient-to-r
                       from-emerald-400 via-teal-500 to-cyan-600
                       dark:from-emerald-500 dark:via-teal-600 dark:to-cyan-700
                       hover:brightness-110 hover:shadow-lg transition-all duration-300 text-center"
          >
            Volver al inicio
          </Link>

          {!isLoggedIn && (
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-3 rounded-lg text-white bg-gradient-to-r
                         from-indigo-500 via-purple-500 to-pink-500
                         dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                         hover:brightness-110 hover:shadow-lg transition-all duration-300"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </main>

      {!isLoggedIn && showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onOpenRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
    </div>
  );
}
