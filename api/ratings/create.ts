import axiosInstance from "../instance";
import type { CreateRatingDto, RatingResponse } from "./type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RATING_KEYS } from "./key";
import { MOVIES_KEYS } from "../movies/key";

interface CreateRatingResponse {
  success: boolean;
  message: string;
  data: RatingResponse;
}

const createRating = async (data: CreateRatingDto): Promise<RatingResponse> => {
  const response = await axiosInstance.post<CreateRatingResponse>(
    "/ratings",
    data,
  );
  return response.data.data;
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (data) => {
      toast.success("Đánh giá thành công!");
      // Invalidate ratings for this movie
      queryClient.invalidateQueries({
        queryKey: RATING_KEYS.byMovie(data.movie_id),
      });
      // Invalidate movie details to update avgRating
      queryClient.invalidateQueries({
        queryKey: MOVIES_KEYS.detail(data.movie_id),
      });
      queryClient.invalidateQueries({
        queryKey: MOVIES_KEYS.all(),
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Đánh giá thất bại";
      toast.error(message);
    },
  });
};
