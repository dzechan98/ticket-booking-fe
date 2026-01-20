import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { GENRES_KEYS } from "./key";
import type { UpdateGenreDto, GenreResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/genres";

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGenreDto }) => {
      try {
        const response = await instance.put<ApiResponse<GenreResponse>>(
          `${URL}/${id}`,
          data,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [GENRES_KEYS.detail(data.id)],
      });
      queryClient.invalidateQueries({ queryKey: [GENRES_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to update genre:", error);
    },
  });
};
