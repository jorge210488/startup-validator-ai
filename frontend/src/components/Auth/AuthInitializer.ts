"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuth(token);
    }
  }, [setAuth]);

  return null;
}
