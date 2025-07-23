"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="w-full bg-transparent absolute bottom-0 left-0 z-20 text-sm text-gray-600 dark:text-gray-300 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-start sm:items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0 text-gray-900 dark:text-white">
          © {new Date().getFullYear()} Startup Validator AI · Todos los derechos
          reservados.
        </div>

        <div className="shrink-0">
          {isClient && (
            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded border border-blue-600 text-blue-600 dark:text-white hover:bg-blue-50 transition"
            >
              ⇧ Inicio
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
