import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { SEATS_KEYS } from "./key";
import type {
  CreateSeatDto,
  CreateMultipleSeatsDto,
  SeatResponse,
} from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/seats";

export const useCreateSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSeatDto) => {
      try {
        const response = await instance.post<ApiResponse<SeatResponse>>(
          URL,
          input,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEATS_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to create seat:", error);
    },
  });
};

export const useCreateMultipleSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMultipleSeatsDto) => {
      try {
        const response = await instance.post<ApiResponse<SeatResponse[]>>(
          `${URL}/bulk`,
          input,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEATS_KEYS.lists()] });
    },
    onError: (error: any) => {
      console.error("Failed to create multiple seats:", error);
    },
  });
};
