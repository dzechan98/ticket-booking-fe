import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MovieCardProps {
  id: string
  title: string
  genre: string
  duration: number
  posterUrl: string
  hasValidShowtime: boolean
}

export function MovieCard({ id, title, genre, duration, posterUrl, hasValidShowtime }: MovieCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg bg-card border border-border hover:border-primary transition-colors">
      {/* Poster Image */}
      <div className="relative overflow-hidden h-64 sm:h-72 md:h-80 bg-secondary">
        <img
          src={posterUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
            {genre}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
            {duration} phút
          </Badge>
        </div>

        {hasValidShowtime ? (
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <Link href={`/movies/${id}`}>Đặt vé</Link>
          </Button>
        ) : (
          <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
            Hết suất chiếu
          </Button>
        )}
      </div>
    </div>
  )
}
