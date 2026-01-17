import { useMutation } from "@tanstack/react-query";
import instance from "../instance";
import { ApiResponse } from "@/types/common";

export interface ChangePasswordInput {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

const URL = "/auth/change-password";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      const response = await instance.put<ApiResponse<ChangePasswordResponse>>(
        URL,
        input,
      );

      return response.data;
    },
  });
};
