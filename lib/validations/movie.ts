import { z } from "zod";

const currentYear = new Date().getFullYear();

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
  country: z
    .string()
    .max(100, "Quốc gia không được vượt quá 100 ký tự")
    .optional(),
  production_year: z
    .number()
    .int("Năm sản xuất phải là số nguyên")
    .min(1888, "Năm sản xuất không hợp lệ")
    .max(currentYear + 5, `Năm sản xuất không được vượt quá ${currentYear + 5}`)
    .optional(),
  release_date: z.string().optional(),
  poster_url: z.string().optional(),
  trailer_url: z.string().optional(),
  genreIds: z.array(z.string()).optional(),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
