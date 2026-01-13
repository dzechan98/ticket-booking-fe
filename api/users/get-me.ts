import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { useStoreContext } from "@/contexts/store";
import { useEffect, useState } from "react";
import { USER_KEYS } from "@/api/users/key";
import { UserResponse } from "@/api/users/type";
import { ApiResponse } from "@/types/common";

const URL = "/users/me";

export const useUserMe = () => {
  const setUser = useStoreContext((state) => state.auth.setUser);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setEnabled(true);
      }
    }
  }, []);

  return useQuery({
    queryKey: [USER_KEYS.userMe()],
    queryFn: async () => {
      try {
        const response = await instance.get<ApiResponse<UserResponse>>(URL);
        setUser(response.data.data);
        return response.data.data;
      } catch (error: any) {
        setUser(null);
        return Promise.reject(error?.response?.data);
      }
    },
    retry: false,
    enabled,
  });
};
