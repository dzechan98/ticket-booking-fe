"use client";

import type { MovieResponse } from "@/api/movies/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isToday, isTomorrow } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, Film, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { MovieRating } from "./movie-rating";

interface MovieDetailsProps {
  movie: MovieResponse;
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  // Filter and sort showtimes - only show from now onwards
  const upcomingShowtimes = useMemo(() => {
    if (!movie.showtimes) return [];

    const now = new Date();

    return movie.showtimes
      .filter((showtime) => {
        const showtimeDate = new Date(showtime.start_time);
        return showtimeDate.getTime() >= now.getTime(); // So sánh theo thời gian chính xác
      })
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
  }, [movie.showtimes]);

  const trailerEmbedUrl = useMemo(() => {
    if (!movie.trailer_url) return null;

    try {
      const url = new URL(movie.trailer_url);

      if (url.hostname.includes("youtu.be")) {
        const videoId = url.pathname.replace("/", "");
        return videoId
          ? `https://www.youtube.com/embed/${videoId}${url.search}`
          : null;
      }

      if (url.hostname.includes("youtube.com")) {
        if (url.pathname === "/watch") {
          const videoId = url.searchParams.get("v");
          const params = new URLSearchParams(url.search);

          params.delete("v");

          return videoId
            ? `https://www.youtube.com/embed/${videoId}${params.toString() ? `?${params.toString()}` : ""}`
            : null;
        }

        if (url.pathname.startsWith("/embed/")) {
          return url.toString();
        }

        if (url.pathname.startsWith("/shorts/")) {
          const videoId = url.pathname.split("/")[2];
          return videoId
            ? `https://www.youtube.com/embed/${videoId}${url.search}`
            : null;
        }
      }

      return null;
    } catch {
      return null;
    }
  }, [movie.trailer_url]);

  const formatShowtimeDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Hôm nay";
    if (isTomorrow(date)) return "Ngày mai";
    return format(date, "EEEE, dd/MM", { locale: vi });
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa công bố";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch {
      return "Không hợp lệ";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Poster and Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          {movie.poster_url ? (
            <div className="relative group">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full rounded-2xl shadow-2xl border-2 border-border object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="w-full aspect-[2/3] bg-muted rounded-2xl shadow-2xl border-2 border-border flex items-center justify-center">
              <p className="text-muted-foreground">Không có poster</p>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {movie.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres && movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-secondary-foreground px-3 py-1 text-xs font-semibold transition-colors duration-200 shadow-sm"
                >
                  {genre.name}
                </Badge>
              ))
            ) : (
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold shadow-sm"
              >
                Chưa phân loại
              </Badge>
            )}
            {movie.avgRating > 0 && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 flex items-center gap-1 text-xs font-bold shadow-md"
              >
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                {movie.avgRating.toFixed(1)}/5
              </Badge>
            )}
          </div>

          <div className="space-y-3 text-muted-foreground mb-6 bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm">
                Ngày phát hành:
              </span>
              <span className="text-sm">{formatDate(movie.release_date)}</span>
            </div>
            <div className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm">
                Thời lượng:
              </span>
              <span className="text-sm">{movie.duration_minutes} phút</span>
            </div>
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex items-center gap-2.5 group">
                <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Film className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground text-sm">
                  Thể loại:
                </span>
                <span className="text-sm">
                  {movie.genres.map((g) => g.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            Lịch chiếu phim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {upcomingShowtimes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {upcomingShowtimes.map((showtime) => (
                <Button
                  key={showtime.id}
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all flex-col h-auto py-3"
                >
                  <Link href={`/booking/${showtime.id}`}>
                    <div className="flex items-center gap-1 font-bold text-base mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(showtime.start_time), "HH:mm")}
                    </div>
                    <div className="text-xs opacity-75 font-medium">
                      {formatShowtimeDate(showtime.start_time)}
                    </div>
                    <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {showtime.room.name}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] mt-1 px-1.5 py-0"
                    >
                      {showtime.room.screen_type}
                    </Badge>
                  </Link>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-muted p-4 rounded-full">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold">
                  Hiện tại không có lịch chiếu
                </p>
                <p className="text-sm text-muted-foreground">
                  Vui lòng quay lại sau hoặc chọn phim khác
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movie Rating Section */}
      <MovieRating
        movieId={movie.id}
        avgRating={movie.avgRating}
        ratings={movie.ratings}
      />

      {/* Description */}
      {movie.description && (
        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full" />
              Nội dung phim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-justify text-sm">
              {movie.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trailer */}
      {movie.trailer_url && (
        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full" />
              Trailer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg overflow-hidden shadow-md border border-border/50">
              {trailerEmbedUrl ? (
                <iframe
                  src={trailerEmbedUrl}
                  title={`${movie.title} trailer`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center">
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Mở trailer
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
