import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { ROOMS_KEYS } from "./key";
import type { RoomResponse } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/rooms";

export const useListRooms = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [ROOMS_KEYS.list(), page, limit],
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<RoomResponse>>
      >(URL, {
        params: { page, limit },
      });

      return response.data.data;
    },

    retry: 1,
  });
};
