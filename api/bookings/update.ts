import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { BOOKINGS_KEYS } from "./key";
import type { UpdateBookingDto, BookingResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/bookings";

export const useUpdateBooking = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateBookingDto) => {
      try {
        const response = await instance.put<ApiResponse<BookingResponse>>(
          `${URL}/${id}`,
          input,
        );
        return response.data.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.detail(id) });
    },
    onError: (error: any) => {
      console.error("Failed to update booking:", error);
    },
  });
};
