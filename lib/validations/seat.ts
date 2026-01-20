import { SeatType } from "@/api/seats/type";
import { z } from "zod";

export const seatTypeLabels: Record<SeatType, string> = {
  [SeatType.NORMAL]: "Tiêu chuẩn",
  [SeatType.VIP]: "VIP",
  [SeatType.COUPLE]: "Ghế đôi",
};

export const createSeatSchema = z.object({
  room_id: z.string().min(1, "Vui lòng chọn phòng chiếu"),
  row: z
    .string()
    .min(1, "Hàng ghế không được để trống")
    .max(5, "Hàng ghế không quá 5 ký tự")
    .regex(/^[A-Z]+$/, "Hàng ghế phải là chữ cái in hoa"),
  column: z
    .number()
    .int()
    .min(1, "Số ghế phải từ 1 trở lên")
    .max(50, "Số ghế không quá 50"),
  type: z.enum([SeatType.NORMAL, SeatType.VIP, SeatType.COUPLE]).optional(),
  price_multiplier: z.number().min(0.5).max(5).optional(),
});

export const updateSeatSchema = z.object({
  row: z
    .string()
    .min(1, "Hàng ghế không được để trống")
    .max(5, "Hàng ghế không quá 5 ký tự")
    .regex(/^[A-Z]+$/, "Hàng ghế phải là chữ cái in hoa")
    .optional(),
  column: z.number().int().min(1).max(50).optional(),
  type: z.enum([SeatType.NORMAL, SeatType.VIP, SeatType.COUPLE]).optional(),
  price_multiplier: z.number().min(0.5).max(5).optional(),
});

export const createMultipleSeatsSchema = z.object({
  room_id: z.string().min(1, "Vui lòng chọn phòng chiếu"),
  rows: z
    .array(z.string().regex(/^[A-Z]+$/, "Hàng ghế phải là chữ cái in hoa"))
    .min(1, "Phải có ít nhất 1 hàng ghế"),
  columns_per_row: z
    .number()
    .int()
    .min(1, "Số ghế mỗi hàng phải từ 1 trở lên")
    .max(50, "Số ghế mỗi hàng không quá 50"),
  seat_type: z
    .enum([SeatType.NORMAL, SeatType.VIP, SeatType.COUPLE])
    .optional(),
  price_multiplier: z.number().min(0.5).max(5).optional(),
});

export type CreateSeatInput = z.infer<typeof createSeatSchema>;
export type UpdateSeatInput = z.infer<typeof updateSeatSchema>;
export type CreateMultipleSeatsInput = z.infer<
  typeof createMultipleSeatsSchema
>;
