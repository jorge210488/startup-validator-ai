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

export const updateMe = async (
  data: { username?: string; email?: string },
  token: string
) => {
  const res = await api.patch("/dj-rest-auth/user/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const changePassword = async (
  payload: {
    old_password?: string;
    new_password1: string;
    new_password2: string;
  },
  token: string
) => {
  const res = await api.post("/dj-rest-auth/password/change/", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
