import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
