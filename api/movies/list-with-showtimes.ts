import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { MOVIES_KEYS } from "./key";
import type { MovieResponse } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/movies/with-showtimes";

interface ListMoviesWithShowtimesParams {
  page?: number;
  limit?: number;
  title?: string;
  genreId?: string;
}

export const useListMoviesWithShowtimes = (
  params: ListMoviesWithShowtimesParams = {},
) => {
  const { page = 1, limit = 10, title, genreId } = params;

  return useQuery({
    queryKey: [
      ...MOVIES_KEYS.list({ page, limit, title, genreId }),
      "with-showtimes",
    ],
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<MovieResponse>>
      >(URL, {
        params: {
          page,
          limit,
          ...(title && { title }),
          ...(genreId && { genreId }),
        },
      });

      return response.data.data;
    },

    retry: 1,
  });
};
