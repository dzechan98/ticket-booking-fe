import { RegisterForm } from "@/components/auth/register-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
