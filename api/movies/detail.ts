import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { MOVIES_KEYS } from "./key";
import type { MovieResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/movies";

export const useMovieDetail = (id?: string) => {
  return useQuery({
    queryKey: MOVIES_KEYS.detail(id),
    queryFn: async () => {
      try {
        const response = await instance.get<ApiResponse<MovieResponse>>(
          `${URL}/${id}`,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    enabled: !!id,
    retry: 1,
  });
};
