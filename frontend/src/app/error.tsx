"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

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

  return (
    <html>
      <body>
        <div className="flex flex-col flex-grow min-h-screen w-full relative text-gray-900 dark:text-white pt-40 md:pt-12">
          {/* Desktop background */}
          <div className="hidden sm:block absolute inset-0 -z-10">
            <Image
              src={isDarkMode ? "/fondo-o3.png" : "/fondo3.jpg"}
              alt="Background"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          {/* Mobile background */}
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
              Algo salió mal
            </h1>
            <p className="opacity-90 max-w-xl mb-6">
              Se produjo un error inesperado. Puedes intentar recargar la vista.
            </p>

            {/* Detalle del error (colapsable) */}
            <details className="bg-white/30 dark:bg-black/30 rounded-lg p-4 mb-6 text-left max-w-2xl w-full">
              <summary className="cursor-pointer font-semibold">
                Ver detalles técnicos
              </summary>
              <pre className="mt-3 whitespace-pre-wrap text-sm opacity-90">
                {error?.message || "Error sin mensaje"}
                {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
              </pre>
            </details>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => reset()}
                className="px-5 py-3 rounded-lg text-white bg-gradient-to-r
                           from-indigo-500 via-purple-500 to-pink-500
                           dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                           hover:brightness-110 hover:shadow-lg transition-all duration-300"
              >
                Reintentar
              </button>
              <Link
                href="/"
                className="px-5 py-3 rounded-lg text-white bg-gradient-to-r
                           from-emerald-400 via-teal-500 to-cyan-600
                           dark:from-emerald-500 dark:via-teal-600 dark:to-cyan-700
                           hover:brightness-110 hover:shadow-lg transition-all duration-300 text-center"
              >
                Volver al inicio
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
