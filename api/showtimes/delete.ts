import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { SHOWTIME_QUERY_KEYS } from "./key";

export const deleteShowtime = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/showtimes/${id}`);
};

export const useDeleteShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIME_QUERY_KEYS.lists() });
    },
  });
};
