import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import type { ApiResponse, PaginatedResponse } from "@/types/common";
import { USER_KEYS } from "@/api/users/key";
import { UserResponse } from "@/api/users/type";

const URL = "/users";

interface ListUsersParams {
  page?: number;
  limit?: number;
  email?: string;
  is_admin?: boolean;
}

export const useListUsers = (params: ListUsersParams = {}) => {
  const { page = 1, limit = 8, email, is_admin } = params;

  return useQuery({
    queryKey: USER_KEYS.list({ page, limit, email, is_admin }),
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<UserResponse>>
      >(URL, {
        params: {
          page,
          limit,
          ...(email && { email }),
          ...(is_admin !== undefined && { is_admin }),
        },
      });

      return response.data.data;
    },

    retry: 1,
  });
};
