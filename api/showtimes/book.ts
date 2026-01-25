import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";
import { BookSeatsDto } from "./type";

export const bookSeats = async (
  showtimeId: string,
  data: BookSeatsDto,
): Promise<void> => {
  const response = await axiosInstance.post(
    `/showtimes/${showtimeId}/book`,
    data,
  );
  return response.data;
};

export const useBookSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      showtimeId,
      data,
    }: {
      showtimeId: string;
      data: BookSeatsDto;
    }) => bookSeats(showtimeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SHOWTIME_QUERY_KEYS.seats(variables.showtimeId),
      });
      queryClient.invalidateQueries({
        queryKey: SHOWTIME_QUERY_KEYS.detail(variables.showtimeId),
      });
    },
  });
};
