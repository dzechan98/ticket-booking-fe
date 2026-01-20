import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { SEATS_KEYS } from "./key";
import type { ApiResponse } from "@/types/common";

const URL = "/seats";

export const useDeleteSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await instance.delete<ApiResponse<void>>(
          `${URL}/${id}`,
        );
        return response.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEATS_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to delete seat:", error);
    },
  });
};
