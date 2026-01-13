import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { ROOMS_KEYS } from "./key";
import type { CreateRoomDto, RoomResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/rooms";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRoomDto) => {
      try {
        const response = await instance.post<ApiResponse<RoomResponse>>(
          URL,
          input
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to create room:", error);
    },
  });
};
