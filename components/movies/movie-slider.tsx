"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListMoviesWithShowtimes } from "@/api/movies/list-with-showtimes";
import Link from "next/link";

export function MovieSlider() {
  const [current, setCurrent] = useState(0);
  const { data } = useListMoviesWithShowtimes({ page: 1, limit: 5 });
  const sliderMovies = data?.items ?? [];

  const next = () =>
    setCurrent((prev) => (prev + 1) % (sliderMovies.length || 1));
  const prev = () =>
    setCurrent(
      (prev) =>
        (prev - 1 + (sliderMovies.length || 1)) % (sliderMovies.length || 1),
    );

  useEffect(() => {
    if (sliderMovies.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [sliderMovies.length]);

  if (sliderMovies.length === 0) {
    return (
      <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-xl bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Chưa có phim nào</p>
      </div>
    );
  }

  const movie = sliderMovies[current];

  return (
    <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-xl bg-secondary">
      {/* Background Image */}
      {movie.poster_url ? (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Không có poster</p>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {movie.title}
        </h2>
        <p className="text-gray-200 mb-2 max-w-md line-clamp-3">
          {movie.description || "Phim hay nhất của tuần, không nên bỏ lỡ!"}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {movie.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 bg-primary/80 text-white text-sm rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <Button
          asChild
          className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Link href={`/movies/${movie.id}`}>Đặt vé ngay</Link>
        </Button>
      </div>

      {/* Controls */}
      {sliderMovies.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {sliderMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === current
                    ? "bg-primary w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
