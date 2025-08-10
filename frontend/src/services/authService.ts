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

export const socialLoginGoogle = (
  tokenOrCode: string,
  isIdToken = false,
  isCode = false
) => {
  let payload: any;
  if (isCode) {
    payload = {
      code: tokenOrCode,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    };
  } else if (isIdToken) {
    payload = { id_token: tokenOrCode };
  } else {
    payload = { access_token: tokenOrCode };
  }
  return api.post("/dj-rest-auth/google/", payload);
};
