import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { MOVIES_KEYS } from "./key";
import type { ApiResponse } from "@/types/common";

const URL = "/movies";

export const useDeleteMovie = () => {
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
      queryClient.invalidateQueries({ queryKey: MOVIES_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: MOVIES_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error("Failed to delete movie:", error);
    },
  });
};
