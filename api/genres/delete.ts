import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { GENRES_KEYS } from "./key";
import type { ApiResponse } from "@/types/common";

const URL = "/genres";

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await instance.delete<ApiResponse<null>>(`${URL}/${id}`);
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [GENRES_KEYS.detail(id)] });
      queryClient.invalidateQueries({ queryKey: [GENRES_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to delete genre:", error);
    },
  });
};
