"use client";

import Link from "next/link";
import { XCircleIcon } from "lucide-react";

export default function PaymentCancelView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-red-100 to-yellow-100 text-center dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <XCircleIcon className="w-20 h-20 text-red-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Pago cancelado</h1>
      <p className="text-lg mb-6">
        Has cancelado el proceso de pago. Puedes intentarlo de nuevo cuando
        quieras.
      </p>
      <div className="flex gap-4">
        <Link
          href="/credits"
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition"
        >
          Volver a mis créditos
        </Link>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
