import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { ROOMS_KEYS } from "./key";
import type { RoomResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/rooms";

export const useRoomDetail = (id?: string) => {
  return useQuery({
    queryKey: [ROOMS_KEYS.detail(id)],
    queryFn: async () => {
      try {
        const response = await instance.get<ApiResponse<RoomResponse>>(
          `${URL}/${id}`
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    enabled: !!id,
    retry: 1,
  });
};
