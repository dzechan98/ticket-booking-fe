import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { ROOMS_KEYS } from "./key";
import type { UpdateRoomDto, RoomResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/rooms";

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoomDto }) => {
      try {
        const response = await instance.put<ApiResponse<RoomResponse>>(
          `${URL}/${id}`,
          data
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_KEYS.detail(data.id)] });
      queryClient.invalidateQueries({ queryKey: [ROOMS_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to update room:", error);
    },
  });
};
