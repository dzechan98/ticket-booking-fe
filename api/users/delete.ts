import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import type { ApiResponse } from "@/types/common";
import { USER_KEYS } from "@/api/users/key";

const URL = "/users";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await instance.delete<ApiResponse<null>>(`${URL}/${id}`);
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.users() });
    },
    onError: (error: any) => {
      console.error("Failed to delete user:", error);
    },
  });
};
