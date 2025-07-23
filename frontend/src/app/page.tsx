"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import RegisterModal from "@/components/RegisterModal";
import LoginModal from "@/components/LoginModal";

export default function HomeView() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { accessToken } = useAuthStore();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full relative text-gray-900 dark:text-white">
      {/* Fondo Desktop */}
      <div className="hidden sm:block absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-o1.png" : "/fondo1.jpg"}
          alt="Fondo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Fondo Móvil */}
      <div className="block sm:hidden absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-m1.png" : "/fondo-s-m1.png"}
          alt="Startup background mobile"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 flex-grow bg-transparent">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Valida tu idea de startup con IA
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-8">
          Ingresa tu idea y recibe una descripción mejorada, nombre sugerido,
          análisis SWOT, tecnologías y más.
        </p>
        {accessToken ? (
          <Link
            href="/ideas/new"
            className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-lg"
          >
            💡 Probar gratis
          </Link>
        ) : (
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-lg"
          >
            ✨ Crear cuenta para comenzar
          </button>
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
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onOpenRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}
      </main>
    </div>
  );
}
