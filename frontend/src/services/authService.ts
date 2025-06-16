import api from "./api";

export const login = (email: string, password: string) => {
  return api.post("/auth/login/", { email, password });
};

export const refreshToken = (refresh: string) => {
  return api.post("/auth/token/refresh/", { refresh });
};
