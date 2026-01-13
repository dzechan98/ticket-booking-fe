import { USER_KEYS } from "@/api/users/key";
import { UserResponse } from "@/api/users/type";
import { useStoreContext } from "@/contexts/store";
import { ApiResponse } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

const URL = "/auth/login";

export const useLogin = () => {
  const setUser = useStoreContext((state) => state.auth.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await instance.post<ApiResponse<LoginResponse>>(
        URL,
        input
      );

      const { data } = response.data;
      localStorage.setItem("accessToken", data?.accessToken);

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [USER_KEYS.userMe()] });

      const user = await queryClient.ensureQueryData<UserResponse>({
        queryKey: [USER_KEYS.userMe()],
      });
      setUser(user);
    },
  });
};
