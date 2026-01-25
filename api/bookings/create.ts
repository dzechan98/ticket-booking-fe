import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { BOOKINGS_KEYS } from "./key";
import type { CreateBookingDto, BookingResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/bookings";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingDto) => {
      try {
        const response = await instance.post<ApiResponse<BookingResponse>>(
          URL,
          input,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.myBookings() });
    },
    onError: (error: any) => {
      console.error("Failed to create booking:", error);
    },
  });
};
