import { SeatResponse } from "@/api/seats/type";
import type { BaseResponse } from "@/types/common";

export type BookingStatus = "pending" | "paid" | "expired" | "cancelled";

export interface CreateBookingDto {
  showtime_id: string;
  seat_ids: string[];
}

export interface UpdateBookingDto {
  showtime_id?: string;
  total_price?: number;
  paid_at?: Date;
}

export interface BookingResponse extends BaseResponse {
  status: BookingStatus;
  transaction_ref: string;
  payment_url?: string;
  vnpay_response_code?: string;
  seat_ids?: string[];
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  showtime: {
    id: string;
    start_time: Date;
    end_time: Date;
    movie: {
      id: string;
      title: string;
      poster_url?: string;
    };
    room: {
      id: string;
      name: string;
    };
  };
  tickets: {
    id: string;
    seat: {
      id: string;
      row: string;
      column: number;
      type: string;
    };
    price: number;
    qr_code: string;
    used_at: Date | null;
  }[];
  total_price: number;
  paid_at: Date | null;
  selected_seats?: SeatResponse[];
}
