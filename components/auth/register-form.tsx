"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useRegister } from "@/api/auth/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { getError } from "@/lib/utils";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mutateAsync: registerMutation } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await registerMutation({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });

      toast.success("Đăng ký thành công");
      router.push("/");
    } catch (error) {
      toast.error(getError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Tạo Tài Khoản</CardTitle>
        <CardDescription className="text-muted-foreground">
          Đăng ký để bắt đầu đặt vé xem phim
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-foreground">
              Họ và tên
            </Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Nguyễn Văn A"
              className="border-border text-foreground placeholder:text-muted-foreground"
              {...register("full_name")}
              disabled={isLoading}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border-border text-foreground placeholder:text-muted-foreground"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-border text-foreground placeholder:text-muted-foreground"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Xác nhận mật khẩu
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="border-border text-foreground placeholder:text-muted-foreground"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
