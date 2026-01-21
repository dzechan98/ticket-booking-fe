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
            {movie.rating > 0 && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 flex items-center gap-1 text-xs font-bold shadow-md"
              >
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                {movie.rating}/10
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
      <Card
        id="showtimes"
        className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            Lịch chiếu phim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const isToday = index === 0;

              return (
                <button
                  key={index}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all duration-200 min-w-[100px] ${
                    index === 0
                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                      : "border-border bg-card hover:border-primary hover:bg-secondary"
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {isToday ? "Hôm nay" : format(date, "EEE", { locale: vi })}
                  </div>
                  <div className="text-sm font-bold mt-1">
                    {format(date, "dd/MM", { locale: vi })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Showtimes by Cinema/Room */}
          <div className="space-y-4">
            {/* Example Cinema 1 */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                Rạp 1 - Phòng Standard
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {["09:00", "11:30", "14:00", "16:30", "19:00", "21:30"].map(
                  (time) => (
                    <Button
                      key={time}
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Link href={`/booking/${movie.id}?time=${time}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Link>
                    </Button>
                  ),
                )}
              </div>
            </div>

            {/* Example Cinema 2 */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                Rạp 2 - Phòng VIP
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {["10:00", "13:00", "15:30", "18:00", "20:30"].map((time) => (
                  <Button
                    key={time}
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Link href={`/booking/${movie.id}?time=${time}`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Example Cinema 3 */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                Rạp 3 - Phòng IMAX
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {["12:00", "14:30", "17:00", "19:30", "22:00"].map((time) => (
                  <Button
                    key={time}
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Link href={`/booking/${movie.id}?time=${time}`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
            <p className="font-semibold mb-1">📌 Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vui lòng đến trước giờ chiếu 15 phút</li>
              <li>Xuất trình mã QR hoặc mã đặt vé tại quầy</li>
              <li>Không hoàn tiền sau khi đã đặt vé</li>
            </ul>
          </div>
        </CardContent>
      </Card>

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
