import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";
import { UpdateShowtimeDto, Showtime } from "./type";

export const updateShowtime = async (
  id: string,
  data: UpdateShowtimeDto,
): Promise<Showtime> => {
  const response = await axiosInstance.put(`/showtimes/${id}`, data);
  return response.data.data;
};

export const useUpdateShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShowtimeDto }) =>
      updateShowtime(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SHOWTIME_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: SHOWTIME_QUERY_KEYS.detail(variables.id),
      });
    },
  });
};
