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

  // ✅ Cerrar modal al hacer clic fuera
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

  // ✅ Obtener idea por ID
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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center">
              Detalle de la Idea
            </h2>
            <p className="text-sm text-center text-gray-500">
              🕓 {new Date(idea.created_at).toLocaleString()}
            </p>

            <div className="my-4">
              <h3 className="text-md font-semibold mb-1">Texto original:</h3>
              <p className="whitespace-pre-wrap">{idea.original_text}</p>
            </div>

            {idea.logo_url && (
              <div className="my-4 text-center">
                <h3 className="text-md font-semibold mb-1">Logo generado:</h3>
                <img
                  src={idea.logo_url}
                  alt="Logo generado"
                  className="mx-auto max-h-48 object-contain"
                />
              </div>
            )}

            <div className="my-4">
              <h3 className="text-md font-semibold mb-1">Análisis IA:</h3>
              {idea.ai_response ? (
                <p className="whitespace-pre-wrap text-sm">
                  {idea.ai_response}
                </p>
              ) : (
                <p className="text-yellow-600">⏳ Aún no está disponible</p>
              )}
            </div>

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

            {idea.status === "pending" && (
              <div className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm">
                ⏳ Esta idea aún está siendo analizada por la IA. Intenta más
                tarde.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
