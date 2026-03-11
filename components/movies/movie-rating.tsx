"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRating } from "@/api/ratings/create";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RatingResponse } from "@/api/ratings/type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MovieRatingProps {
  movieId: string;
  avgRating: number;
  ratings?: RatingResponse[];
}

export function MovieRating({
  movieId,
  avgRating,
  ratings = [],
}: MovieRatingProps) {
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: createRating, isPending } = useCreateRating();

  const handleRatingClick = (rating: number) => {
    if (!user) return;
    setSelectedRating(rating);
  };

  const handleSubmitRating = () => {
    if (!user || selectedRating === 0) return;
    createRating(
      {
        movie_id: movieId,
        rating: selectedRating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setSelectedRating(0);
          setHoveredRating(0);
          setComment("");
        },
      },
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <div className="h-6 w-1 bg-primary rounded-full" />
          Đánh giá phim
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating Display */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 flex items-baseline gap-1">
              {avgRating > 0 ? avgRating.toFixed(1) : "N/A"}
              {avgRating > 0 && (
                <span className="text-lg text-muted-foreground">/5</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {ratings.length} đánh giá
              </span>
            </div>
          </div>
          {avgRating > 0 && (
            <div className="flex-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-6 w-6 transition-colors",
                      star <= Math.round(avgRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300 dark:text-gray-600",
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Rating Input */}
        {user ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Đánh giá của bạn:
            </p>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isPending}
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={cn(
                    "h-14 w-14 p-0 border-2 transition-all rounded-xl",
                    (hoveredRating >= rating || selectedRating >= rating) &&
                      "border-yellow-500 bg-yellow-500/20 scale-110",
                    isPending && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-all",
                      hoveredRating >= rating || selectedRating >= rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground",
                    )}
                  />
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Chọn số sao từ 1 đến 5 để đánh giá phim này
            </p>
            {selectedRating > 0 && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Viết nhận xét của bạn về phim... (không bắt buộc)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isPending}
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {comment.length}/500 ký tự
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRating(0);
                        setComment("");
                      }}
                      disabled={isPending}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSubmitRating}
                      disabled={isPending}
                    >
                      {isPending ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Đăng nhập để đánh giá phim
            </p>
            <Button asChild variant="default" size="sm">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        )}

        {/* Ratings List */}
        {ratings.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Đánh giá từ người dùng:
            </p>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      {rating.user?.avatar && (
                        <AvatarImage
                          src={rating.user.avatar}
                          alt={rating.user.full_name || rating.user.email}
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(rating.user?.full_name || null)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {rating.user?.full_name || rating.user?.email}
                        </p>
                        <div className="flex items-center gap-0.5 bg-yellow-500/20 px-2 py-0.5 rounded border border-yellow-500/30">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-3 w-3",
                                star <= rating.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300 dark:text-gray-600",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(rating.created_at),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi },
                        )}
                      </p>
                      {rating.comment && (
                        <p className="text-sm text-foreground mt-2 leading-relaxed">
                          {rating.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
