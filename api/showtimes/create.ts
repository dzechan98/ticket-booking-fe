import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";
import { CreateShowtimeDto, Showtime } from "./type";

export const createShowtime = async (
  data: CreateShowtimeDto,
): Promise<Showtime> => {
  const response = await axiosInstance.post("/showtimes", data);
  return response.data.data;
};

export const useCreateShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIME_QUERY_KEYS.lists() });
    },
  });
};
