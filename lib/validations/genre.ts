import { z } from "zod";

export const createGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Tên thể loại là bắt buộc")
    .max(100, "Tên thể loại không được vượt quá 100 ký tự"),
  description: z.string().optional(),
});

export type CreateGenreInput = z.infer<typeof createGenreSchema>;
