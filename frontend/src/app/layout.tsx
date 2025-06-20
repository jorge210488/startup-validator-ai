// ✅ /app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { AuthInitializer } from "@/components/AuthInitializer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
        <AuthInitializer />
        <Navbar />
        <main className="px-4 py-6 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
