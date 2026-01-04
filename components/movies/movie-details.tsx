import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActorProps {
  name: string
  role: string
  avatar: string
}

interface MovieDetailsProps {
  id: string
  title: string
  genre: string
  duration: number
  releaseDate: string
  description: string
  posterUrl: string
  actors: ActorProps[]
  rating: number
}

export function MovieDetails({
  id,
  title,
  genre,
  duration,
  releaseDate,
  description,
  posterUrl,
  actors,
  rating,
}: MovieDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Header with Poster and Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <img
            src={posterUrl || "/placeholder.svg"}
            alt={title}
            className="w-full rounded-lg shadow-lg border border-border"
          />
        </div>

        {/* Movie Info */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1">
              {genre}
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1">
              ⭐ {rating}/10
            </Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-3 py-1">
              {duration} phút
            </Badge>
          </div>

          <div className="space-y-3 text-muted-foreground mb-8">
            <p>
              <span className="font-semibold text-foreground">Ngày phát hành:</span> {releaseDate}
            </p>
            <p>
              <span className="font-semibold text-foreground">Thể loại:</span> {genre}
            </p>
            <p>
              <span className="font-semibold text-foreground">Thời lượng:</span> {duration} phút
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Link href={`/booking/${id}`}>Đặt vé ngay</Link>
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Nội dung phim</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed text-justify">{description}</p>
        </CardContent>
      </Card>

      {/* Cast */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Diễn viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {actors.map((actor, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={actor.avatar || "/placeholder.svg"}
                  alt={actor.name}
                  className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-border"
                />
                <p className="font-semibold text-foreground text-center text-sm">{actor.name}</p>
                <p className="text-muted-foreground text-xs text-center">{actor.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trailer */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Trailer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">▶️</div>
              <p className="text-muted-foreground">Video trailer sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
