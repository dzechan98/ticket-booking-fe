import { z } from "zod";
import { Gender } from "@/api/users/type";

export const updateUserSchema = z.object({
  full_name: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email(),
  dob: z.string().optional(),
  gender: z.nativeEnum(Gender),
  is_admin: z.boolean(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createUserSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  full_name: z.string().min(1, "Họ tên không được để trống"),
  dob: z.string().optional(),
  gender: z.nativeEnum(Gender),
  is_admin: z.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
