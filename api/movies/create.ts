import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { MOVIES_KEYS } from "./key";
import type { CreateMovieDto, MovieResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/movies";

export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMovieDto) => {
      try {
        const response = await instance.post<ApiResponse<MovieResponse>>(
          URL,
          input
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error("Failed to create movie:", error);
    },
  });
};
