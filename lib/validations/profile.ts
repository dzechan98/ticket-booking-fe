import { Gender } from "@/api/users/type";
import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  gender: z.nativeEnum(Gender),
  dob: z.string().min(1, "Vui lòng chọn ngày sinh"),
  avatar: z.string().min(1, "Vui lòng chọn ảnh đại diện"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
