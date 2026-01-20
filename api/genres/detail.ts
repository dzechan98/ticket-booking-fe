import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { GENRES_KEYS } from "./key";
import type { GenreResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/genres";

export const useGenreDetail = (id?: string) => {
  return useQuery({
    queryKey: [GENRES_KEYS.detail(id)],
    queryFn: async () => {
      try {
        const response = await instance.get<ApiResponse<GenreResponse>>(
          `${URL}/${id}`
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
