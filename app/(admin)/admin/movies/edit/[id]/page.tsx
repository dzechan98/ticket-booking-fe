"use client";

import { useMovieDetail } from "@/api/movies/detail";
import { useUpdateMovie } from "@/api/movies/update";
import { MovieForm } from "@/components/admin/movies/movie-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CreateMovieInput } from "@/lib/validations/movie";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  const { data: movie, isLoading } = useMovieDetail(movieId);
  const { mutateAsync: updateMovie, isPending } = useUpdateMovie();

  const handleUpdate = async (data: CreateMovieInput) => {
    try {
      await updateMovie({ id: movieId, data });
      toast.success("Cập nhật phim thành công!");
      router.push("/admin/movies");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật phim");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-center text-muted-foreground">Không tìm thấy phim</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Chỉnh sửa phim
        </h1>
        <p className="text-muted-foreground">
          Cập nhật thông tin phim: {movie.title}
        </p>
      </div>

      {/* Form Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Thông tin phim</CardTitle>
        </CardHeader>
        <CardContent>
          <MovieForm
            initialData={{
              title: movie.title,
              description: movie.description || "",
              duration_minutes: movie.duration_minutes,
              release_date: movie.release_date || "",
              poster_url: movie.poster_url || "",
              trailer_url: movie.trailer_url || "",
              genreIds: movie.genres?.map((g) => g.id) || [],
            }}
            onSubmit={handleUpdate}
            isLoading={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
