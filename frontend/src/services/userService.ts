import api from "./api";

export const suspenderUsuario = async (
  user_id: number,
  reason: string,
  token: string
) => {
  const response = await api.post(
    "/admin-suspender-usuario/",
    {
      user_id,
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
