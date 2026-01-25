import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";
import { ShowtimeSeatsResponse } from "./type";

export const getShowtimeSeats = async (
  id: string,
): Promise<ShowtimeSeatsResponse> => {
  const response = await axiosInstance.get(`/showtimes/${id}/seats`);
  return response.data.data;
};

export const useShowtimeSeats = (id: string) => {
  return useQuery({
    queryKey: SHOWTIME_QUERY_KEYS.seats(id),
    queryFn: () => getShowtimeSeats(id),
    enabled: !!id,
  });
};
