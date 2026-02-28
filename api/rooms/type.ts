import type { BaseResponse } from "@/types/common";

export enum ScreenType {
  STANDARD = "STANDARD",
  IMAX = "IMAX",
  SCREEN_X = "SCREEN_X",
  GOLD_CLASS = "GOLD_CLASS",
}

export interface CreateRoomDto {
  name: string;
  screen_type: ScreenType;
}

export interface UpdateRoomDto {
  name?: string;
  screen_type?: ScreenType;
}

export interface RoomResponse extends BaseResponse {
  name: string;
  screen_type: ScreenType;
  total_seats: number;
}
