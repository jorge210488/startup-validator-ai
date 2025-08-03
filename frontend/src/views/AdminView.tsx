"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAdminUsers } from "@/services/adminService";
// Importar los componentes de modales de recarga y suspensión (a implementar por separado)
import RechargeCreditModal from "@/components//Admin/RechargeCreditModal";
import SuspendUserModal from "@/components/Admin/SuspendUserModal";
import EnableUserModal from "@/components/Admin/EnableUserModal";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  credits: number;
  is_active: boolean;
}

export default function AdminDashboard() {
  const { accessToken } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userToRecharge, setUserToRecharge] = useState<AdminUser | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<AdminUser | null>(null);
  const [userToEnable, setUserToEnable] = useState<AdminUser | null>(null);

  const updateUserInList = (updatedUser: AdminUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // Detectar cambios de tema (claro/oscuro) para actualizar el fondo
  useEffect(() => {
    setIsMounted(true);
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    getAdminUsers(accessToken)
      .then((users) => {
        setUsers(users); // ya devuelve el array
      })
      .catch((err) => console.error("❌ Error al obtener usuarios:", err))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col flex-grow min-h-0 w-full md:pb-0 pb-20 relative text-gray-900 dark:text-white pt-40 md:pt-12">
      {/* Fondo de escritorio */}
      <div className="hidden sm:block absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-o3.png" : "/fondo3.jpg"}
          alt="Fondo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      {/* Fondo móvil */}
      <div className="block sm:hidden absolute inset-0 -z-10">
        <Image
          src={isDarkMode ? "/fondo-m3.png" : "/fondo-s-m3.png"}
          alt="Fondo mobile"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 flex-grow">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Administrar Usuarios
        </h1>

        {/** Estado de carga, sin usuarios o listado */}
        {loading ? (
          <p className="text-lg">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="text-lg">No hay usuarios.</p>
        ) : (
          <div className="w-full max-w-3xl pb-12 space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                           bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-30 
                           rounded-lg px-4 py-3 shadow-md"
              >
                {/* Información del usuario */}
                <div className="mb-2 sm:mb-0 text-left">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm opacity-80">{user.email}</p>
                </div>
                {/* Créditos y botones de acción */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium mr-2">
                    Créditos: {user.credits}
                  </span>
                  <button
                    onClick={() => {
                      setUserToRecharge(user);
                      setUserToSuspend(null); // asegurarse de cerrar otro modal si estuviera abierto
                    }}
                    className="px-4 py-2 rounded-lg text-white 
                               bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                               dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600
                               hover:brightness-110 hover:shadow-lg transition-all duration-300"
                  >
                    Recargar
                  </button>
                  {user.is_active ? (
                    <button
                      onClick={() => {
                        setUserToSuspend(user);
                        setUserToRecharge(null);
                        setUserToEnable(null);
                      }}
                      className="px-4 py-2 rounded-lg text-white 
               bg-gradient-to-r from-red-500 to-red-600 
               dark:from-red-600 dark:to-red-700
               hover:brightness-110 hover:shadow-lg transition-all duration-300"
                    >
                      Suspender
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserToEnable(user);
                        setUserToSuspend(null);
                        setUserToRecharge(null);
                      }}
                      className="px-4 py-2 rounded-lg text-white 
               bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600
               dark:from-emerald-500 dark:via-teal-600 dark:to-cyan-700
               hover:brightness-110 hover:shadow-lg transition-all duration-300"
                    >
                      Habilitar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modales de Recarga y Suspensión */}
      {userToRecharge && (
        <RechargeCreditModal
          user={userToRecharge}
          onClose={() => setUserToRecharge(null)}
          onUserUpdate={updateUserInList}
        />
      )}
      {userToSuspend && (
        <SuspendUserModal
          user={userToSuspend}
          onClose={() => setUserToSuspend(null)}
          onUserUpdate={updateUserInList}
        />
      )}
      {userToEnable && (
        <EnableUserModal
          user={userToEnable}
          onClose={() => setUserToEnable(null)}
          onUserUpdate={updateUserInList}
        />
      )}
    </div>
  );
}
