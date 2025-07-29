import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthInitializer } from "@/components/AuthInitializer";
import { ThemeProvider } from "@/components/ThemeProvider"; // 👈

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-transparent text-gray-900 dark:text-white transition-colors">
        {/* 👇👇👇 id="top" agregado para que scrollIntoView funcione 👇👇👇 */}
        <div id="top" className="min-h-dvh flex flex-col">
          <ThemeProvider>
            <AuthInitializer />
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
