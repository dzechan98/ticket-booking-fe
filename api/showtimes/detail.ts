import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";
import { Showtime } from "./type";

export const getShowtimeById = async (id: string): Promise<Showtime> => {
  const response = await axiosInstance.get(`/showtimes/${id}`);
  return response.data.data;
};

export const useShowtime = (id: string) => {
  return useQuery({
    queryKey: SHOWTIME_QUERY_KEYS.detail(id),
    queryFn: () => getShowtimeById(id),
    enabled: !!id,
  });
};
