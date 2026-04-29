import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { GenreResponse } from "@/api/genres/type";

interface MovieCardProps {
  id: string;
  title: string;
  genres: GenreResponse[];
  duration: number;
  posterUrl: string | null;
  avgRating: number;
  country?: string | null;
  productionYear?: number | null;
}

export function MovieCard({
  id,
  title,
  genres,
  duration,
  posterUrl,
  avgRating,
  country,
  productionYear,
}: MovieCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl bg-card border border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
      {/* Poster Image */}
      <div className="relative overflow-hidden h-48 sm:h-56 md:h-64 bg-secondary">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Không có poster</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Rating Badge */}
        {avgRating > 0 && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-yellow-400/30">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-bold text-sm">
              {avgRating.toFixed(1)}/5
            </span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-3">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {genres && genres.length > 0 ? (
            genres.slice(0, 2).map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="text-xs bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {genre.name}
              </Badge>
            ))
          ) : (
            <Badge
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              Chưa phân loại
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="text-xs bg-secondary text-secondary-foreground"
          >
            {duration} phút
          </Badge>
          {productionYear && (
            <Badge
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              {productionYear}
            </Badge>
          )}
          {country && (
            <Badge
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground"
            >
              {country}
            </Badge>
          )}
        </div>

        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Link href={`/movies/${id}`}>Đặt vé ngay</Link>
        </Button>
      </div>
    </div>
  );
}
