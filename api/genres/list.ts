import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { GENRES_KEYS } from "./key";
import type { GenreResponse } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/genres";

interface ListGenresParams {
  page?: number;
  limit?: number;
  name?: string;
}

export const useListGenres = (params: ListGenresParams = {}) => {
  const { page = 1, limit = 10, name } = params;

  return useQuery({
    queryKey: [GENRES_KEYS.list(), page, limit, name],
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<GenreResponse>>
      >(URL, {
        params: {
          page,
          limit,
          ...(name && { name }),
        },
      });

      return response.data.data;
    },

    retry: 1,
  });
};
