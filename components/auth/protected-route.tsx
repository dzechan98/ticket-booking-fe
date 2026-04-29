"use client";

import { useUserMe } from "@/api/users/get-me";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type AccessRole = "user" | "admin";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allow: AccessRole;
};

export function ProtectedRoute({ children, allow }: ProtectedRouteProps) {
  useUserMe();
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allow === "admin" && !user.is_admin) {
      if (!hasNotifiedRef.current) {
        toast.error("Bạn không có quyền truy cập khu vực quản trị");
        hasNotifiedRef.current = true;
      }
      router.replace("/");
      return;
    }

    if (allow === "user" && user.is_admin) {
      if (!hasNotifiedRef.current) {
        toast.error("Tài khoản Admin không thể truy cập trang người dùng");
        hasNotifiedRef.current = true;
      }
      router.replace("/admin");
    }
  }, [allow, hydrated, router, user]);

  const isUnauthorized =
    !hydrated ||
    !user ||
    (allow === "admin" && user && !user.is_admin) ||
    (allow === "user" && user && user.is_admin);

  if (isUnauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return children;
}
