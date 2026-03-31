"use client";

import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chatbot/chatbot";
import React from "react";

export default function LayoutUser({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedRoute allow="user">
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        {children}
        <Footer />
        {!user?.is_admin && <Chatbot />}
      </div>
    </ProtectedRoute>
  );
}
