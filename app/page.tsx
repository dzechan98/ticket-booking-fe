"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chatbot/chatbot";
import { MovieSlider } from "@/components/movies/movie-slider";
import { MovieCard } from "@/components/movies/movie-card";
import { useListMoviesWithShowtimes } from "@/api/movies/list-with-showtimes";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function HomePage() {
  const { data, isLoading } = useListMoviesWithShowtimes({ page: 1, limit: 6 });
  const movies = data?.items ?? [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Slider */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MovieSlider />
        </section>

        {/* Currently Showing Movies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Phim đang chiếu
            </h2>
            <p className="text-muted-foreground">
              Tìm và đặt vé cho bộ phim yêu thích của bạn
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="h-10 w-10" />
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Hiện tại chưa có phim nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  genres={movie.genres}
                  duration={movie.duration_minutes}
                  posterUrl={movie.poster_url}
                  rating={movie.rating}
                />
              ))}
            </div>
          )}
        </section>

        {/* View All Movies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Link
            href="/movies"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition"
          >
            Xem tất cả phim
          </Link>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
