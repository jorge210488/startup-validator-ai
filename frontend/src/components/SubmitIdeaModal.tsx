"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { submitIdea } from "@/services/ideasService";

type SubmitIdeaModalProps = {
  onClose: () => void;
};

export default function SubmitIdeaModal({ onClose }: SubmitIdeaModalProps) {
  const [originalText, setOriginalText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { accessToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!originalText.trim()) {
      setError("Por favor escribe tu idea.");
      setLoading(false);
      return;
    }

    if (!accessToken) {
      setError("No estás autenticado.");
      setLoading(false);
      return;
    }

    try {
      await submitIdea(originalText, accessToken);
      onClose(); // Cierra el modal al éxito
    } catch (err: any) {
      console.error("Error al enviar idea:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">💡 Nueva idea</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            placeholder="Escribe tu idea de startup..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            required
            rows={5}
            className="px-4 py-2 rounded border bg-gray-100 dark:bg-gray-900 resize-none"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar idea"}
          </button>
        </form>
      </div>
    </div>
  );
}
