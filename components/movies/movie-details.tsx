import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Clock, Film } from "lucide-react";
import type { MovieResponse } from "@/api/movies/type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

interface MovieDetailsProps {
  movie: MovieResponse;
}

export function MovieDetails({ movie }: MovieDetailsProps) {
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
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg border border-border object-cover"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-muted rounded-lg shadow-lg border border-border flex items-center justify-center">
              <p className="text-muted-foreground">Không có poster</p>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {movie.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres && movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground px-3 py-1"
                >
                  {genre.name}
                </Badge>
              ))
            ) : (
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground px-3 py-1"
              >
                Chưa phân loại
              </Badge>
            )}
            {movie.rating > 0 && (
              <Badge
                variant="secondary"
                className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 flex items-center gap-1"
              >
                <Star className="h-4 w-4 fill-current" />
                {movie.rating}/10
              </Badge>
            )}
          </div>

          <div className="space-y-3 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold text-foreground">
                Ngày phát hành:
              </span>
              <span>{formatDate(movie.release_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold text-foreground">Thời lượng:</span>
              <span>{movie.duration_minutes} phút</span>
            </div>
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                <span className="font-semibold text-foreground">Thể loại:</span>
                <span>{movie.genres.map((g) => g.name).join(", ")}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Link href={`/booking/${movie.id}`}>Đặt vé ngay</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary"
            >
              <Link href={`/movies/${movie.id}#showtimes`}>Xem suất chiếu</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      {movie.description && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Nội dung phim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {movie.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Trailer */}
      {movie.trailer_url && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Trailer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
              {movie.trailer_url.includes("youtube.com") ||
              movie.trailer_url.includes("youtu.be") ? (
                <iframe
                  src={movie.trailer_url
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "youtube.com/embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <a
                      href={movie.trailer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Xem trailer tại đây
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
