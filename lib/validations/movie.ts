import { z } from "zod";

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Tên phim là bắt buộc")
    .max(255, "Tên phim không được vượt quá 255 ký tự"),
  description: z.string().optional(),
  duration_minutes: z
    .number()
    .min(1, "Thời lượng phải lớn hơn 0")
    .max(500, "Thời lượng không hợp lệ"),
  release_date: z.string().optional(),
  poster_url: z.string().optional(),
  trailer_url: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
