import api from "./api";

export const login = (username: string, password: string) => {
  return api.post("/login/", { username, password });
};

export const refreshToken = (refresh: string) => {
  return api.post("/dj-rest-auth/token/refresh/", { refresh });
};

export const register = (
  username: string,
  email: string,
  password1: string,
  password2: string
) => {
  return api.post("/dj-rest-auth/registration/", {
    username,
    email,
    password1,
    password2,
  });
};
