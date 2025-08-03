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

// frontend/services/userService.ts
export const habilitarUsuario = async (user_id: number, token: string) => {
  const response = await api.post(
    "/admin-habilitar-usuario/",
    { user_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
