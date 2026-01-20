"use client";

import { useCreateMovie } from "@/api/movies/create";
import { MovieForm } from "@/components/admin/movies/movie-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateMovieInput } from "@/lib/validations/movie";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateMoviePage() {
  const router = useRouter();
  const { mutateAsync: createMovie, isPending } = useCreateMovie();

  const handleCreate = async (data: CreateMovieInput) => {
    try {
      await createMovie(data);
      toast.success("Tạo phim thành công!");
      router.push("/admin/movies");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tạo phim");
      throw error;
    }
  };

  return (
    <div className="p-6 md:p-8 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tạo phim mới
        </h1>
        <p className="text-muted-foreground">
          Thêm phim mới vào hệ thống rạp chiếu
        </p>
      </div>

      {/* Form Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Thông tin phim</CardTitle>
        </CardHeader>
        <CardContent>
          <MovieForm onSubmit={handleCreate} isLoading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
