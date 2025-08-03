import api from "./api";

export const getAdminUsers = async (token: string) => {
  const response = await api.get("/admin-users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const recargarCreditos = async (
  user_id: number,
  amount: number,
  reason: string,
  token: string
) => {
  const response = await api.post(
    "/admin-recargar-creditos/",
    {
      user_id,
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
