import type { BaseResponse } from "@/types/common";
import type { GenreResponse } from "../genres/type";
import type { Showtime } from "../showtimes/type";

export interface CreateMovieDto {
  title: string;
  description?: string;
  duration_minutes: number;
  release_date?: string;
  poster_url?: string;
  trailer_url?: string;
  genreIds?: string[];
  rating?: number;
}

export interface UpdateMovieDto {
  title?: string;
  description?: string;
  duration_minutes?: number;
  release_date?: string;
  poster_url?: string;
  trailer_url?: string;
  genreIds?: string[];
  rating?: number;
}

export interface MovieResponse extends BaseResponse {
  title: string;
  description: string | null;
  duration_minutes: number;
  release_date: string | null;
  poster_url: string | null;
  trailer_url: string | null;
  genres: GenreResponse[];
  rating: number;
  showtimes?: Showtime[];
}
