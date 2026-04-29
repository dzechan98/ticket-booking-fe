import type { BookingStatus } from "@/api/bookings/type";
import type { SeatType } from "@/api/seats/type";
import type { BaseResponse } from "@/types/common";

export interface TicketResponse extends BaseResponse {
  booking: {
    id: string;
    status: BookingStatus;
    user: {
      id: string;
      email: string;
      full_name: string;
    };
  };
  showtime: {
    id: string;
    start_time: string;
    movie: {
      id: string;
      title: string;
    };
    room: {
      id: string;
      name: string;
    };
  };
  seat: {
    id: string;
    row: string;
    column: number;
    type: SeatType;
  };
  price: number;
  qr_code: string;
  used_at: string | null;
}
