import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import type { UserResponse } from "./type";
import type { ApiResponse } from "@/types/common";
import { USER_KEYS } from "@/api/users/key";

export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  dob?: string;
  gender?: string;
  is_admin: boolean;
}

const URL = "/users";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      try {
        const response = await instance.post<ApiResponse<UserResponse>>(
          URL,
          input,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.users() });
    },
    onError: (error: any) => {
      console.error("Failed to create user:", error);
    },
  });
};
