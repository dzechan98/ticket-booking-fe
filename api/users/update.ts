import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { USER_KEYS } from "./key";
import type { UserResponse } from "./type";
import type { ApiResponse } from "@/types/common";
import { useStoreContext } from "@/contexts/store";

export interface UpdateProfileInput {
  email?: string;
  full_name?: string;
  avatar?: string;
  dob?: string;
  gender?: string;
}

const URL = "/users";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useStoreContext((state) => state.auth.setUser);

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      try {
        const response = await instance.put<ApiResponse<UserResponse>>(
          URL,
          input
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: [USER_KEYS.userMe()] });
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
    },
  });
};
