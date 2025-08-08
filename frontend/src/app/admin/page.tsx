"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "@/views/AdminView";

export default function AdminPage() {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken || !user?.is_superuser) {
      router.replace("/unauthorized");
    }
  }, [user, accessToken, router]);

  if (!accessToken || !user?.is_superuser) return null;

  return <AdminDashboard />;
}
