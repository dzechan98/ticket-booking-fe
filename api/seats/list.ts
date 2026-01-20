import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { SEATS_KEYS } from "./key";
import type { SeatResponse } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/seats";

interface ListSeatsParams {
  page?: number;
  limit?: number;
  room_id?: string;
  type?: string;
}

export const useListSeats = (params: ListSeatsParams = {}) => {
  const { page = 1, limit = 10, room_id, type } = params;

  return useQuery({
    queryKey: [SEATS_KEYS.list(), page, limit, room_id, type],
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<SeatResponse>>
      >(URL, {
        params: {
          page,
          limit,
          ...(room_id && { room_id }),
          ...(type && { type }),
        },
      });

      return response.data.data;
    },
    retry: 1,
  });
};
