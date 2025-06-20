"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { getUserFromToken } from "@/utils/token";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const user = getUserFromToken(token);
      if (user) {
        useAuthStore.getState().setAuth(token, user);
      }
    }
  }, []);

  return (
    <html lang="es">
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
        <Navbar />
        <main className="px-4 py-6 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
