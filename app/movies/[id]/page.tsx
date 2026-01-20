"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MovieDetails } from "@/components/movies/movie-details";
import { useMovieDetail } from "@/api/movies/detail";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;

  const { data: movie, isLoading } = useMovieDetail(movieId);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="h-10 w-10" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Không tìm thấy phim
            </h1>
            <p className="text-muted-foreground">
              Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MovieDetails movie={movie} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
