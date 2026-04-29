"use client";

import { Showtime } from "@/api/showtimes/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  screenTypeLabels,
  showtimeStatusLabels,
} from "@/lib/utils/enum-labels";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Armchair, Calendar, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ShowtimeCardProps {
  showtime: Showtime;
}

export function ShowtimeCard({ showtime }: ShowtimeCardProps) {
  const startTime = new Date(showtime.start_time);
  const endTime = new Date(showtime.end_time);

  const isDisabled =
    showtime.status === "FINISHED" || showtime.status === "CANCELLED";

  const router = useRouter();

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Movie Info - Left Side */}
        <div className="lg:col-span-4 bg-gradient-to-br from-muted/50 to-background p-6">
          <div className="flex gap-5">
            {/* Poster */}
            <div className="relative w-28 h-40 rounded-lg overflow-hidden shrink-0 shadow-lg ring-2 ring-border group-hover:ring-primary/30 transition-all">
              <Image
                src={showtime.movie.poster_url || "/placeholder-movie.jpg"}
                alt={showtime.movie.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {showtime.movie.title}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm text-foreground">
                      {showtime.movie.avgRating}
                    </span>
                    <span className="text-xs text-muted-foreground">/5</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {showtime.movie.duration_minutes}m
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {showtime.movie.genres?.slice(0, 3).map((genre: any) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 font-medium"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Showtime Details - Right Side */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4">
            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Ngày chiếu</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {format(startTime, "dd/MM/yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(startTime, "EEEE", { locale: vi })}
              </p>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Giờ chiếu</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {format(startTime, "HH:mm")}
              </p>
              <p className="text-xs text-muted-foreground">
                Kết thúc {format(endTime, "HH:mm")}
              </p>
            </div>

            {/* Room */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Phòng chiếu</span>
              </div>
              <p className="text-base font-bold text-foreground">
                {showtime.room.name}
              </p>
              <Badge variant="outline" className="text-xs font-medium w-fit">
                {screenTypeLabels[showtime.room.screen_type]}
              </Badge>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                <span>Giá vé</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {showtime.base_price.toLocaleString()}đ
              </p>
              <p className="text-xs text-muted-foreground">/vé</p>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Badge
              variant={
                showtime.status === "UPCOMING"
                  ? "default"
                  : showtime.status === "ONGOING"
                    ? "secondary"
                    : "outline"
              }
              className="text-sm px-3 py-1"
            >
              {showtimeStatusLabels[showtime.status]}
            </Badge>

            <Button
              size="lg"
              disabled={isDisabled}
              className={`${
                !isDisabled
                  ? "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  : ""
              } transition-all duration-200 px-8`}
              onClick={() => router.push(`/booking/${showtime.id}`)}
            >
              <Armchair className="h-4 w-4 mr-2" />
              <span className="font-semibold">Đặt vé ngay</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
