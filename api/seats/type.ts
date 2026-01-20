import { RoomResponse } from "@/api/rooms/type";
import type { BaseResponse } from "@/types/common";

export enum SeatType {
  NORMAL = "NORMAL",
  VIP = "VIP",
  COUPLE = "COUPLE",
}

export interface CreateSeatDto {
  room_id: string;
  row: string;
  column: number;
  type?: SeatType;
  price_multiplier?: number;
}

export interface UpdateSeatDto {
  row?: string;
  column?: number;
  type?: SeatType;
  price_multiplier?: number;
}

export interface CreateMultipleSeatsDto {
  room_id: string;
  rows: string[];
  columns_per_row: number;
  seat_type?: SeatType;
  price_multiplier?: number;
}

export interface SeatResponse extends BaseResponse {
  room_id: string;
  row: string;
  column: number;
  type: SeatType;
  price_multiplier: number;
  is_available: boolean;
  room: RoomResponse;
}
