import api from "./api";

// 🔹 Obtener historial de transacciones de créditos del usuario
export const getMyCreditTransactions = async (token: string) => {
  const response = await api.get("/my-credit-transactions/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // ← Array de transacciones
};

// 🔹 Recargar créditos como admin (opcional, solo para administradores)
export const adminRechargeCredits = async (
  userId: number,
  amount: number,
  reason: string,
  token: string
) => {
  const response = await api.post(
    "/admin-recargar-creditos/",
    {
      user_id: userId,
      amount,
      reason,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // ← { message, new_credits }
};

export const getMe = async (token: string) => {
  const response = await api.get("/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // ← { id, username, email, credits }
};

// 🔹 Confirmar pago de Stripe desde frontend
export const confirmStripeSession = async (
  sessionId: string,
  token: string
) => {
  const response = await api.post(
    "/stripe/confirm-payment/",
    { session_id: sessionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // ← { message } o { error }
};
