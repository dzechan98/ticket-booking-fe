import { z } from "zod"

export const bookingSchema = z.object({
  showId: z.string().min(1, "Vui lòng chọn suất chiếu"),
  seats: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một ghế"),
})

export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Số thẻ phải có 16 chữ số"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Định dạng MM/YY"),
  cvv: z.string().regex(/^\d{3}$/, "CVV phải có 3 chữ số"),
})

export type BookingInput = z.infer<typeof bookingSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
