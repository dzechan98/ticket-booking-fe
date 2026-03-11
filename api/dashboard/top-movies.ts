import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { DASHBOARD_KEYS } from "./key";
import type { TopMovie } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/dashboard/top-movies";

interface TopMoviesParams {
  limit?: number;
}

export const useTopMovies = (params: TopMoviesParams = {}) => {
  const { limit = 5 } = params;

  return useQuery({
    queryKey: DASHBOARD_KEYS.topMovies(limit),
    queryFn: async () => {
      const response = await instance.get<ApiResponse<TopMovie[]>>(URL, {
        params: { limit },
      });
      return response.data;
    },
  });
};
