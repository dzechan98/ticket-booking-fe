import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../instance";
import { BOOKINGS_KEYS } from "./key";
import type { ApiResponse } from "@/types/common";

const URL = "/bookings";

// Admin: Delete any booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await instance.delete<ApiResponse<null>>(
          `${URL}/${id}`,
        );
        return response.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.lists() });
    },
    onError: (error: any) => {
      console.error("Failed to delete booking:", error);
    },
  });
};

// User: Delete own booking
export const useDeleteMyBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await instance.delete<ApiResponse<null>>(
          `${URL}/me/${id}`,
        );
        return response.data;
      } catch (error: any) {
        return Promise.reject(error?.response?.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEYS.myBookings() });
    },
    onError: (error: any) => {
      console.error("Failed to delete my booking:", error);
    },
  });
};
