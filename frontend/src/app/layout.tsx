import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modo Oscuro Forzado",
  description: "App con Tailwind y modo oscuro activado manualmente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {" "}
      {/* 👈 Modo oscuro forzado */}
      <body className="bg-white text-black dark:bg-zinc-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
