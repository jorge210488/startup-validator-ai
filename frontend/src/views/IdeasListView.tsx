"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import SubmitIdeaModal from "@/components/Ideas/SubmitIdeaModal";
import { getMyIdeas } from "@/services/ideasService";
import IdeaDetailModal from "@/components/Ideas/IdeaDetailModal";

interface StartupIdea {
  id: number;
  original_text: string;
  status: "pending" | "completed" | "error";
  created_at: string;
}

export default function IdeasListView() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const { accessToken } = useAuthStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (accessToken) {
      getMyIdeas(accessToken)
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("📦 Ideas recibidas del backend:", data);

            setIdeas(data);
          } else {
            console.error("❌ La respuesta no es un array:", data);
            setIdeas([]);
          }
        })
        .catch((err) => console.error("❌ Error al obtener ideas:", err));
    }
  }, [accessToken]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full relative md:pb-0 pb-20 pt-40 text-gray-900 dark:text-white">
      {/* Fondo Desktop */}
      <div
        className={`hidden sm:block absolute inset-0 -z-10 bg-top bg-cover bg-repeat-y ${
          isDarkMode ? "bg-[url('/fondo-o2.png')]" : "bg-[url('/fondo2.jpg')]"
        }`}
      />

      {/* Fondo Móvil */}
      <div
        className={`block sm:hidden absolute inset-0 -z-10 bg-top bg-cover bg-repeat-y ${
          isDarkMode
            ? "bg-[url('/fondo-m2.png')]"
            : "bg-[url('/fondo-s-m2.png')]"
        }`}
      />

      <main className="flex flex-col items-center justify-center text-center px-6 flex-grow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Mis ideas</h1>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3 mb-8 rounded-lg bg-gradient-to-r 
    from-indigo-500 via-purple-500 to-pink-500 
    dark:from-indigo-700 dark:via-purple-800 dark:to-pink-700 
    text-white font-semibold hover:brightness-110 shadow-md hover:shadow-lg 
    transition-all duration-300 text-lg"
        >
          💡 Crear nueva idea
        </button>

        {ideas.length === 0 ? (
          <p className="text-lg">Aún no has generado ninguna idea.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full pb-12">
            {ideas.map((idea) => (
              <button
                key={idea.id}
                onClick={() => setSelectedIdeaId(idea.id)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 p-6 rounded-xl transition text-left"
              >
                <h2 className="text-xl font-semibold mb-2 truncate">
                  {idea.original_text.slice(0, 80)}...
                </h2>
                <p className="text-sm mb-1">
                  🕓 {new Date(idea.created_at).toLocaleDateString()}
                </p>
                <p
                  className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                    idea.status === "completed"
                      ? "bg-green-600"
                      : idea.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {idea.status.toUpperCase()}
                </p>
              </button>
            ))}
          </div>
        )}
      </main>
      {showSubmitModal && (
        <SubmitIdeaModal
          onClose={() => {
            setShowSubmitModal(false);

            if (accessToken) {
              getMyIdeas(accessToken)
                .then((data) => setIdeas(data))
                .catch((err) =>
                  console.error(
                    "❌ Error al recargar ideas después del modal:",
                    err
                  )
                );
            }
          }}
        />
      )}
      {selectedIdeaId && (
        <IdeaDetailModal
          ideaId={selectedIdeaId}
          onClose={() => setSelectedIdeaId(null)}
        />
      )}
    </div>
  );
}
