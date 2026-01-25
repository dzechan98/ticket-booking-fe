"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Armchair, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Showtime } from "@/api/showtimes/type";
import { format } from "date-fns";

interface ShowtimeCardProps {
  showtime: Showtime;
}

export function ShowtimeCard({ showtime }: ShowtimeCardProps) {
  const startTime = new Date(showtime.start_time);
  const endTime = new Date(showtime.end_time);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        {/* Movie Info */}
        <div className="md:col-span-2">
          <div className="flex gap-4">
            {/* Poster */}
            <div className="relative w-24 h-36 rounded-md overflow-hidden shrink-0">
              <Image
                src={showtime.movie.poster_url || "/placeholder-movie.jpg"}
                alt={showtime.movie.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-base text-foreground line-clamp-2">
                {showtime.movie.title}
              </h3>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-foreground">
                    {showtime.movie.rating}
                  </span>
                  <span>/ 10</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{showtime.movie.duration_minutes} phút</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {showtime.movie.genres?.map((genre: any) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="text-xs px-1.5 py-0"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showtime Details */}
        <div className="md:col-span-3 space-y-3">
          <div className="p-4 rounded-md border border-border bg-muted/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Ngày chiếu</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {format(startTime, "dd/MM/yyyy")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Giờ chiếu</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Phòng chiếu</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {showtime.room.name}
                </p>
                <Badge variant="outline" className="text-xs">
                  {showtime.room.screen_type}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Giá vé</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {showtime.base_price.toLocaleString()}đ
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant={
                  showtime.status === "UPCOMING"
                    ? "default"
                    : showtime.status === "ONGOING"
                      ? "secondary"
                      : "outline"
                }
              >
                {showtime.status === "UPCOMING"
                  ? "Sắp chiếu"
                  : showtime.status === "ONGOING"
                    ? "Đang chiếu"
                    : showtime.status === "FINISHED"
                      ? "Đã chiếu"
                      : "Đã hủy"}
              </Badge>

              <Link href={`/booking/${showtime.id}`}>
                <Button
                  size="sm"
                  disabled={
                    showtime.status === "FINISHED" ||
                    showtime.status === "CANCELLED"
                  }
                >
                  <Armchair className="h-4 w-4 mr-2" />
                  Đặt vé
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
