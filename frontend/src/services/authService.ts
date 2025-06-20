import api from "./api";

export const login = (username: string, password: string) => {
  return api.post("/login/", { username, password });
};

export const refreshToken = (refresh: string) => {
  return api.post("/dj-rest-auth/token/refresh/", { refresh });
};
