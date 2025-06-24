"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 shadow-inner transition-colors px-6 py-4">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-start sm:items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          © {new Date().getFullYear()} Startup Validator AI · Todos los derechos
          reservados.
        </div>

        <div className="shrink-0">
          <Link
            href="/"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            ⇧ Inicio
          </Link>
        </div>
      </div>
    </footer>
  );
}
