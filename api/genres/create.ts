import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { GENRES_KEYS } from "./key";
import type { CreateGenreDto, GenreResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/genres";

export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateGenreDto) => {
      try {
        const response = await instance.post<ApiResponse<GenreResponse>>(
          URL,
          input,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GENRES_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to create genre:", error);
    },
  });
};
