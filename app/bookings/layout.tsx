import { ProtectedRoute } from "@/components/auth/protected-route";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allow="user">{children}</ProtectedRoute>;
}
