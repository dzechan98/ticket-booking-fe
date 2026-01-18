import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import type { ApiResponse, PaginatedResponse } from "@/types/common";
import { USER_KEYS } from "@/api/users/key";
import { UserResponse } from "@/api/users/type";

const URL = "/users";

export const useListUsers = (page = 1, limit = 8) => {
  return useQuery({
    queryKey: USER_KEYS.list({ page, limit }),
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<UserResponse>>
      >(URL, {
        params: { page, limit },
      });

      return response.data.data;
    },

    retry: 1,
  });
};
