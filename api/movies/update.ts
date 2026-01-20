import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { MOVIES_KEYS } from "./key";
import type { UpdateMovieDto, MovieResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/movies";

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMovieDto }) => {
      try {
        const response = await instance.put<ApiResponse<MovieResponse>>(
          `${URL}/${id}`,
          data,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MOVIES_KEYS.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: MOVIES_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error("Failed to update movie:", error);
    },
  });
};
