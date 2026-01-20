import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { SEATS_KEYS } from "./key";
import type { SeatResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/seats";

export const useGetSeat = (id?: string) => {
  return useQuery({
    queryKey: [SEATS_KEYS.detail(id)],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<SeatResponse>>(
        `${URL}/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
  });
};

export const useGetSeatsByRoom = (roomId?: string) => {
  return useQuery({
    queryKey: [SEATS_KEYS.byRoom(roomId)],
    queryFn: async () => {
      const response = await instance.get<ApiResponse<SeatResponse[]>>(
        `${URL}/room/${roomId}`,
      );
      return response.data.data;
    },
    enabled: !!roomId,
    retry: 1,
  });
};
