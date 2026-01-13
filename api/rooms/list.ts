import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { ROOMS_KEYS } from "./key";
import type { RoomResponse } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/rooms";

export const useListRooms = () => {
  return useQuery({
    queryKey: [ROOMS_KEYS.list()],
    queryFn: async () => {
      try {
        const response = await instance.get<
          ApiResponse<PaginatedResponse<RoomResponse> | RoomResponse[]>
        >(URL);
        const data = response.data.data;
        return Array.isArray(data) ? data : data.items;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    retry: 1,
  });
};
