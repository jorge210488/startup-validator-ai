"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { confirmStripeSession, getMe } from "@/services/creditsService";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import Link from "next/link";
import { useCreditStore } from "@/store/creditStore";

export default function PaymentSuccessView() {
  const { accessToken } = useAuthStore();
  const { setCredits } = useCreditStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId || !accessToken) {
      setStatus("error");
      setMessage("Falta el ID de la sesión o el token de acceso.");
      return;
    }

    const confirmPayment = async () => {
      try {
        const data = await confirmStripeSession(sessionId, accessToken);
        setStatus("success");
        setMessage(
          data.message || "¡Créditos añadidos correctamente a tu cuenta! 🎉"
        );

        // Actualizar créditos en el store
        const me = await getMe(accessToken);
        setCredits(me.credits);
      } catch (err: any) {
        console.error("❌ Error al confirmar:", err);
        setStatus("error");
        setMessage(err?.response?.data?.error || "Error al confirmar el pago.");
      }
    };

    confirmPayment();
  }, [sessionId, accessToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-green-100 to-blue-200 text-center dark:from-gray-900 dark:to-gray-800 dark:text-white">
      {status === "loading" && (
        <p className="text-2xl font-semibold animate-pulse">
          Confirmando tu pago...
        </p>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircleIcon className="w-20 h-20 text-green-600" />
          <h1 className="text-3xl font-bold">{message}</h1>
          <Link
            href="/credits"
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition"
          >
            Volver a tus transacciones
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircleIcon className="w-20 h-20 text-red-600" />
          <h1 className="text-2xl font-bold">Error en el pago</h1>
          <p>{message}</p>
          <Link
            href="/credits"
            className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition"
          >
            Volver a tus transacciones
          </Link>
        </div>
      )}
    </div>
  );
}
