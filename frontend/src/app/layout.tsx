// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Layout/Footer";
import { AuthInitializer } from "@/components/Auth/AuthInitializer";
import { ThemeProvider } from "@/components/Layout/ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!; // asegúrate de setearlo en .env

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-transparent text-gray-900 dark:text-white transition-colors">
        <div id="top" className="min-h-dvh flex flex-col">
          <GoogleOAuthProvider clientId={clientId}>
            <ThemeProvider>
              <AuthInitializer />
              <Navbar />
              <main className="flex-grow flex flex-col">{children}</main>
              <Footer />
            </ThemeProvider>
          </GoogleOAuthProvider>
        </div>
      </body>
    </html>
  );
}
