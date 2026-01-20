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
  rating: number;
}

export function MovieCard({
  id,
  title,
  genres,
  duration,
  posterUrl,
  rating,
}: MovieCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition-colors">
      {/* Poster Image */}
      <div className="relative overflow-hidden h-64 sm:h-72 md:h-80 bg-secondary">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Không có poster</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-sm">{rating}</span>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {genres && genres.length > 0 ? (
            genres.slice(0, 2).map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="text-xs bg-secondary text-secondary-foreground"
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
        </div>

        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Link href={`/movies/${id}`}>Đặt vé</Link>
        </Button>
      </div>
    </div>
  );
}
