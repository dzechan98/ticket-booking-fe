import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { SEATS_KEYS } from "./key";
import type { UpdateSeatDto, SeatResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/seats";

interface UpdateSeatParams {
  id: string;
  data: UpdateSeatDto;
}

export const useUpdateSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateSeatParams) => {
      try {
        const response = await instance.put<ApiResponse<SeatResponse>>(
          `${URL}/${id}`,
          data,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SEATS_KEYS.lists()] });
      queryClient.invalidateQueries({
        queryKey: [SEATS_KEYS.detail(variables.id)],
      });
    },
    onError: (error: any) => {
      console.error("Failed to update seat:", error);
    },
  });
};
