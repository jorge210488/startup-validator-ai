import api from "./api";

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
  return response.data;
};

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
  return response.data;
};
