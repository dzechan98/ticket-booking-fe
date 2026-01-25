import { MovieResponse } from "../movies/type";
import { RoomResponse } from "../rooms/type";

export enum ShowtimeStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}

export interface Showtime {
  id: string;
  movie: MovieResponse;
  room: RoomResponse;
  start_time: string;
  end_time: string;
  base_price: number;
  status: ShowtimeStatus;
  created_at: string;
  updated_at: string;
}

export interface ShowtimeSeat {
  id: string;
  row: string;
  column: number;
  type: "NORMAL" | "VIP" | "COUPLE";
  is_booked: boolean;
  final_price: number;
}

export interface ShowtimeSeatsResponse {
  showtime_id: string;
  seats: ShowtimeSeat[];
}

export interface CreateShowtimeDto {
  movie_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  base_price: number;
}

export interface UpdateShowtimeDto {
  movie_id?: string;
  room_id?: string;
  start_time?: string;
  end_time?: string;
  base_price?: number;
  status?: ShowtimeStatus;
}

export interface BookSeatsDto {
  seat_ids: string[];
}
