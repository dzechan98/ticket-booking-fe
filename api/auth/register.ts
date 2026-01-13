import { useMutation } from "@tanstack/react-query";
import instance from "../instance";
import { LoginResponse } from "@/api/auth/login";
import { ApiResponse } from "@/types/common";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse extends LoginResponse {}

const URL = "/auth/register";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await instance.post<ApiResponse<RegisterResponse>>(
        URL,
        input
      );

      return response.data;
    },
  });
};
