import axiosInstance from "../instance";
import type { RatingResponse } from "./type";
import { useQuery } from "@tanstack/react-query";
import { RATING_KEYS } from "./key";

interface GetRatingsByMovieResponse {
  success: boolean;
  message: string;
  data: RatingResponse[];
}

const getRatingsByMovie = async (
  movieId: string,
): Promise<RatingResponse[]> => {
  const response = await axiosInstance.get<GetRatingsByMovieResponse>(
    `/ratings/movie/${movieId}`,
  );
  return response.data.data;
};

export const useGetRatingsByMovie = (movieId: string) => {
  return useQuery({
    queryKey: RATING_KEYS.byMovie(movieId),
    queryFn: () => getRatingsByMovie(movieId),
    enabled: !!movieId,
  });
};
