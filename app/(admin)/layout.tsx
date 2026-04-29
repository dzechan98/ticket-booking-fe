"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import React from "react";

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allow="admin">{children}</ProtectedRoute>;
}
