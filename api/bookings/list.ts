import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { BOOKINGS_KEYS } from "./key";
import type { BookingResponse, BookingStatus } from "./type";
import type { ApiResponse, PaginatedResponse } from "@/types/common";

const URL = "/bookings";

interface ListBookingsParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
}

// Admin: Get all bookings
export const useListBookings = (params: ListBookingsParams = {}) => {
  const { page = 1, limit = 10, status } = params;

  return useQuery({
    queryKey: BOOKINGS_KEYS.list({ page, limit, status }),
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<BookingResponse>>
      >(URL, {
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
        },
      });

      return response.data.data;
    },
    retry: 1,
  });
};

// User: Get my bookings
export const useMyBookings = (params: ListBookingsParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: BOOKINGS_KEYS.myBookings(),
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<BookingResponse>>
      >(`${URL}/me`, {
        params: {
          page,
          limit,
        },
      });

      return response.data.data;
    },
    retry: 1,
  });
};
