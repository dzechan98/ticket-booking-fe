import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">🎬 CineHub</h1>
          <p className="text-muted-foreground">Hệ thống đặt vé xem phim</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
