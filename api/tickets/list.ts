import { useQuery } from "@tanstack/react-query";
import instance from "@/api/instance";
import type { ApiResponse, PaginatedResponse } from "@/types/common";
import { TICKETS_KEYS } from "./key";
import type { TicketResponse } from "./type";

const URL = "/tickets";

interface ListTicketsParams {
  booking_id?: string;
  page?: number;
  limit?: number;
}

export const useTickets = (params: ListTicketsParams = {}) => {
  const { booking_id, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: TICKETS_KEYS.list({ booking_id, page, limit }),
    queryFn: async () => {
      const response = await instance.get<
        ApiResponse<PaginatedResponse<TicketResponse>>
      >(URL, {
        params: {
          booking_id,
          page,
          limit,
        },
      });

      return response.data.data;
    },
    enabled: !!booking_id,
    retry: 0,
  });
};
