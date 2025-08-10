"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { changePassword, updateMe } from "@/services/userService";
import { getMe } from "@/services/creditsService";

type UpdateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UpdateUserModal({
  isOpen,
  onClose,
}: UpdateUserModalProps) {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Perfil
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Dropdown contraseña
  const [showPwd, setShowPwd] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  // Cargar perfil actual
  useEffect(() => {
    if (!isOpen) return;
    if (!accessToken) return;

    let mounted = true;
    setLoading(true);
    setError(null);
    setSuccess(null);

    getMe(accessToken)
      .then((data) => {
        if (!mounted) return;
        setUsername(data.username || "");
        setEmail(data.email || "");
      })
      .catch((err: any) => {
        console.error(err);
        setError("No se pudo cargar tu perfil.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [isOpen, accessToken]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateMe({ username, email }, accessToken);

      // Opcional: actualizar el store para reflejar cambios en UI
      // (tu store no expone acción, pero con zustand podés hacer esto:)
      // @ts-ignore
      useAuthStore.setState((prev: any) => ({
        ...prev,
        user: {
          ...(prev.user || {}),
          username: updated.username,
          email: updated.email,
        },
      }));

      setSuccess("Perfil actualizado correctamente.");
    } catch (err: any) {
      console.error(err?.response?.data || err?.message);
      // Mostrar los mensajes del serializer si vienen
      const msg =
        err?.response?.data?.username?.[0] ||
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.detail ||
        "No se pudo actualizar el perfil.";
      setError(String(msg));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!accessToken) return;

    setPwdSaving(true);
    setError(null);
    setSuccess(null);

    if (newPassword1 !== newPassword2) {
      setPwdSaving(false);
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      await changePassword(
        {
          old_password: oldPassword, // si en settings desactivás old_password, podés enviar undefined
          new_password1: newPassword1,
          new_password2: newPassword2,
        },
        accessToken
      );

      setSuccess("Contraseña actualizada correctamente.");
      setOldPassword("");
      setNewPassword1("");
      setNewPassword2("");
      setShowPwd(false);
    } catch (err: any) {
      console.error(err?.response?.data || err?.message);
      const data = err?.response?.data;
      const msg =
        data?.old_password?.[0] ||
        data?.new_password1?.[0] ||
        data?.new_password2?.[0] ||
        data?.non_field_errors?.[0] ||
        data?.detail ||
        "No se pudo actualizar la contraseña.";
      setError(String(msg));
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          👤 Actualizar perfil
        </h2>

        {loading ? (
          <p className="text-center opacity-80">Cargando...</p>
        ) : (
          <>
            {/* Mensajes */}
            {error && (
              <div className="mb-3 text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded p-2">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 rounded p-2">
                {success}
              </div>
            )}

            {/* Form perfil */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm mb-1">Nombre de usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700
                             bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700
                             bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg text-white 
                           bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600
                           dark:from-emerald-500 dark:via-teal-600 dark:to-cyan-700
                           hover:brightness-110 hover:shadow-lg transition-all duration-300
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>

            {/* Toggle contraseña */}
            <div className="mt-6">
              <button
                onClick={() => setShowPwd((v) => !v)}
                className="w-full px-4 py-2 rounded-lg text-white 
                           bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                           dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                           hover:brightness-110 hover:shadow-lg transition-all duration-300"
              >
                {showPwd
                  ? "Ocultar cambio de contraseña"
                  : "Actualizar contraseña"}
              </button>

              {showPwd && (
                <div className="mt-4 space-y-3 bg-white/60 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {/* Si en settings desactivás OLD_PASSWORD_FIELD_ENABLED, este campo podría omitirse */}
                  <div>
                    <label className="block text-sm mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700
                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword1}
                      onChange={(e) => setNewPassword1(e.target.value)}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700
                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Repetir nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword2}
                      onChange={(e) => setNewPassword2(e.target.value)}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700
                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={pwdSaving}
                    className="w-full px-4 py-2 rounded-lg text-white 
                               bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                               dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                               hover:brightness-110 hover:shadow-lg transition-all duration-300
                               disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {pwdSaving ? "Actualizando..." : "Cambiar contraseña"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
