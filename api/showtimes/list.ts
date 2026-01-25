import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";
import { Showtime } from "./type";

interface ShowtimeListParams {
  page?: number;
  limit?: number;
  movie_id?: string;
  room_id?: string;
  status?: string;
  date?: string;
}

interface ShowtimeListResponse {
  items: Showtime[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getShowtimes = async (
  params?: ShowtimeListParams,
): Promise<ShowtimeListResponse> => {
  const response = await axiosInstance.get("/showtimes", { params });
  return response.data.data;
};

export const useShowtimes = (params?: ShowtimeListParams) => {
  return useQuery({
    queryKey: SHOWTIME_QUERY_KEYS.list(params),
    queryFn: () => getShowtimes(params),
  });
};
