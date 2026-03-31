import { ProtectedRoute } from "@/components/auth/protected-route";

export default function PaymentFailedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allow="user">{children}</ProtectedRoute>;
}
