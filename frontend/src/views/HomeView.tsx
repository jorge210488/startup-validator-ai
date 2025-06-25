"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomeView() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Fondo Desktop CLARO */}
      <div className="sm:block hidden absolute inset-0 -z-10 dark:hidden">
        <Image
          src="/fondo1.jpg"
          alt="Fondo claro"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Fondo Desktop OSCURO */}
      <div className="sm:block hidden absolute inset-0 -z-10 dark:block">
        <Image
          src="/fondo-o1.jpg"
          alt="Fondo oscuro"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* Fondo para móvil */}
      <div className="block sm:hidden absolute inset-0 -z-10">
        <Image
          src="/background-mobile.png"
          alt="Startup background mobile"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Valida tu idea de startup con IA
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-8">
          Ingresa tu idea y recibe una descripción mejorada, nombre sugerido,
          análisis SWOT, tecnologías y más.
        </p>
        <Link
          href="/ideas/new"
          className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-lg"
        >
          💡 Probar gratis
        </Link>
      </main>
    </div>
  );
}
