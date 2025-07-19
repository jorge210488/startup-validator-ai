// services/stripeService.ts
import api from "./api";

// 🔹 Crear sesión de pago con Stripe
export const createStripeSession = async (
  amount: number,
  token: string
): Promise<{ checkout_url: string }> => {
  const response = await api.post(
    "/stripe/create-payment/",
    { credits: amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // { checkout_url }
};

// 🔹 (Opcional) Confirmar el pago desde el frontend después de volver de Stripe
export const confirmStripePayment = async (
  sessionId: string,
  token: string
): Promise<{ status: string; credits_added: number }> => {
  const response = await api.post(
    "/stripe/confirm-payment/",
    { session_id: sessionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // { status, credits_added }
};
