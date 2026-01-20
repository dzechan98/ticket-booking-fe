import type { BaseResponse } from "@/types/common";

export interface CreateGenreDto {
  name: string;
  description?: string;
}

export interface UpdateGenreDto {
  name?: string;
  description?: string;
}

export interface GenreResponse extends BaseResponse {
  name: string;
  description: string | null;
}
