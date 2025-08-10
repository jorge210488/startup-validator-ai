import api from "./api";

export const getMyCreditTransactions = async (token: string) => {
  const response = await api.get("/my-credit-transactions/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

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
  return response.data;
};

export const getMe = async (token: string) => {
  const response = await api.get("/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

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
  return response.data;
};
