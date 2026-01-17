"use client";

import { useUserMe } from "@/api/users/get-me";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  useUserMe();
  const router = useRouter();
  const { user, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
      return;
    }

    if (hydrated && user && !user.is_admin) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [user, router, hydrated]);

  if (!hydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return children;
}
