"use client";

import { useEffect, useRef, useState } from "react";
import { getIdeaById } from "@/services/ideasService";
import { useAuthStore } from "@/store/authStore";

interface IdeaDetailModalProps {
  ideaId: number;
  onClose: () => void;
}

export default function IdeaDetailModal({
  ideaId,
  onClose,
}: IdeaDetailModalProps) {
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthStore();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Cargar la idea
  useEffect(() => {
    if (!accessToken) return;
    getIdeaById(ideaId, accessToken)
      .then((data) => {
        setIdea(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener la idea:", err);
        setLoading(false);
      });
  }, [ideaId, accessToken]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 pb-20">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] p-6 relative animate-fade-in-up overflow-y-auto"
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          💡 Detalles de la Idea
        </h2>

        {loading ? (
          <p className="text-center">⏳ Cargando...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Fecha */}
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              🕓 {new Date(idea.created_at).toLocaleString()}
            </p>

            {/* Texto original */}
            <div>
              <h3 className="text-md font-semibold mb-1">📝 Texto original:</h3>
              <p className="text-sm whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-3 rounded">
                {idea.original_text}
              </p>
            </div>

            {/* Logo */}
            {idea.logo_url && (
              <div className="text-center">
                <h3 className="text-md font-semibold mb-1">🖼 Logo generado:</h3>
                <img
                  src={idea.logo_url}
                  alt="Logo generado"
                  className="mx-auto max-h-48 object-contain rounded"
                />
              </div>
            )}

            {/* Análisis IA */}
            <div>
              <h3 className="text-md font-semibold mb-1">🤖 Análisis IA:</h3>
              <div className="text-sm whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-3 rounded">
                {idea.ai_response || (
                  <p className="text-yellow-600">⏳ Aún no está disponible</p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="flex justify-center mt-2">
              <div className="flex justify-center mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                    idea.status === "completed"
                      ? "text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                      : idea.status === "pending"
                      ? "text-black dark:text-white bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"
                      : "text-white bg-gradient-to-r from-rose-500 via-red-500 to-pink-500"
                  }`}
                >
                  {idea.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Mensaje si está pendiente */}
            {idea.status === "pending" && (
              <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded text-sm mt-2 text-center">
                ⏳ Esta idea aún está siendo analizada por la IA. Intenta más
                tarde.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
