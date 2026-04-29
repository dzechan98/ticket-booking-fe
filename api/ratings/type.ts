import type { BaseResponse } from "@/types/common";

export interface UserInfo {
  id: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
}

export interface RatingResponse extends BaseResponse {
  rating: number;
  comment: string | null;
  movie_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: UserInfo;
}

export interface CreateRatingDto {
  movie_id: string;
  rating: number;
  comment?: string;
}
