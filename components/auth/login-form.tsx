"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useLogin } from "@/api/auth/login";
import { useUserMe } from "@/api/users/get-me";
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

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { mutateAsync: loginMutation } = useLogin();
  const { refetch: refetchUser } = useUserMe();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await loginMutation(data);

      const userResult = await refetchUser();

      if (userResult.data?.is_admin) {
        toast.success("Đăng nhập thành công");
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Đăng nhập thất bại";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Đăng Nhập</CardTitle>
        <CardDescription className="text-muted-foreground">
          Vào tài khoản của bạn để đặt vé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
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
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </Button>
        </form>

        <div className="mt-6 space-y-4 text-center text-sm text-muted-foreground">
          <Link
            href="/forgot-password"
            className="block hover:text-primary transition"
          >
            Quên mật khẩu?
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-border" />
            <span>hoặc</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <p>
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
