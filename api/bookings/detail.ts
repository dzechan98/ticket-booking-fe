import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { BOOKINGS_KEYS } from "./key";
import type { BookingResponse } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/bookings";

// Admin: Get booking by ID
export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: BOOKINGS_KEYS.detail(id),
    queryFn: async () => {
      const response = await instance.get<ApiResponse<BookingResponse>>(
        `${URL}/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
  });
};

// User: Get my booking by ID
export const useMyBookingDetail = (id: string) => {
  return useQuery({
    queryKey: BOOKINGS_KEYS.myBooking(id),
    queryFn: async () => {
      const response = await instance.get<ApiResponse<BookingResponse>>(
        `${URL}/me/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
    retry: 1,
  });
};
