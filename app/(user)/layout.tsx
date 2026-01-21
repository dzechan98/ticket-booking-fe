"use client";

import { useUserMe } from "@/api/users/get-me";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chatbot/chatbot";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function LayoutUser({
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
  }, [user, router, hydrated]);

  if (!hydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
      <Chatbot />
    </div>
  );
}
