"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useChangePassword } from "@/api/auth/change-password";
import {
  ChangePasswordInput,
  changePasswordSchema,
} from "@/lib/validations/profile";
import { Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { register, handleSubmit, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const changePasswordMutation = useChangePassword();

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePasswordMutation.mutateAsync({
        old_password: data.currentPassword,
        new_password: data.newPassword,
      });

      toast.success("Đổi mật khẩu thành công 🎉");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current password */}
          <div className="space-y-2">
            <Label>Mật khẩu hiện tại</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div className="space-y-2">
            <Label>Mật khẩu mới</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label>Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? "Đang xử lý..."
              : "Đổi mật khẩu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
