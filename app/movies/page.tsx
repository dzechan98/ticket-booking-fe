"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MovieCard } from "@/components/movies/movie-card";
import { useListMoviesWithShowtimes } from "@/api/movies/list-with-showtimes";
import { useListGenres } from "@/api/genres/list";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasePagination } from "@/components/common/base-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { useListMovies } from "@/api/movies/list";

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data: moviesData, isLoading } = useListMovies({
    page,
    limit: 12,
    title: debouncedSearch || undefined,
    genreId: genreFilter === "all" ? undefined : genreFilter,
  });

  const { data: genresData } = useListGenres({ limit: 100 });
  const genres = genresData?.items ?? [];
  const movies = moviesData?.items ?? [];

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, genreFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Danh sách phim
            </h1>
            <p className="text-muted-foreground">
              Khám phá và đặt vé cho các bộ phim đang chiếu
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Input
              placeholder="Tìm kiếm phim..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Thể loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thể loại</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Movies Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-10 w-10" />
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {search || genreFilter !== "all"
                  ? "Không tìm thấy phim nào"
                  : "Hiện tại chưa có phim nào"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    genres={movie.genres}
                    duration={movie.duration_minutes}
                    posterUrl={movie.poster_url}
                    avgRating={movie.avgRating}
                  />
                ))}
              </div>

              {/* Pagination */}
              {moviesData && moviesData.totalPages > 1 && (
                <div className="mt-8">
                  <BasePagination
                    page={moviesData.page}
                    totalPages={moviesData.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
