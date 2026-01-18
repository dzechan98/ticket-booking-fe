import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { ROOMS_KEYS } from "./key";
import type { RoomResponse } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/rooms";

interface ListRoomsParams {
  page?: number;
  limit?: number;
  name?: string;
  screen_type?: string;
}

export const useListRooms = (params: ListRoomsParams = {}) => {
  const { page = 1, limit = 10, name, screen_type } = params;

  return useQuery({
    queryKey: [ROOMS_KEYS.list(), page, limit, name, screen_type],
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<RoomResponse>>
      >(URL, {
        params: {
          page,
          limit,
          ...(name && { name }),
          ...(screen_type && { screen_type }),
        },
      });

      return response.data.data;
    },

    retry: 1,
  });
};
