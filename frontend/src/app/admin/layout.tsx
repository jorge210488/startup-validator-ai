// app/admin/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getUserFromToken } from "@/utils/token";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 👇 en tu setup, cookies() es async
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/unauthorized");
  }

  let user: any = null;
  try {
    user = getUserFromToken(token);
  } catch {
    redirect("/unauthorized");
  }

  if (!user?.is_superuser) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
