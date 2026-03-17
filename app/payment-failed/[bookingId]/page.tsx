"use client";

import { useMyBookingDetail } from "@/api/bookings/detail";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Home,
  Loader2,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data: booking, isLoading } = useMyBookingDetail(bookingId);

  const getFailureReason = (status?: string) => {
    switch (status) {
      case "cancelled":
        return "Giao dịch đã bị hủy";
      case "expired":
        return "Đã hết thời gian thanh toán (5 phút)";
      default:
        return "Thanh toán không thành công";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Đang tải thông tin...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 bg-linear-to-b from-red-50/50 via-background to-background dark:from-red-950/10">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Failure Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Thanh toán thất bại
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              {getFailureReason(booking?.status)}
            </p>
          </div>

          {/* Booking Info (if available) */}
          {booking && (
            <Card className="mb-6 shadow-lg border-red-200 dark:border-red-900">
              <CardHeader className="border-b">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Thông tin đặt vé
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Movie Info */}
                <div className="flex gap-4">
                  <div className="relative w-20 h-30 rounded-lg overflow-hidden shadow-md ring-2 ring-border shrink-0">
                    <Image
                      src={
                        booking.showtime.movie.poster_url ||
                        "/placeholder-movie.jpg"
                      }
                      alt={booking.showtime.movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                      {booking.showtime.movie.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        Mã: {booking.transaction_ref}
                      </Badge>
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      >
                        {booking.status === "cancelled"
                          ? "Đã hủy"
                          : booking.status === "expired"
                            ? "Hết hạn"
                            : "Chưa thanh toán"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Showtime Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Ngày chiếu</span>
                    </div>
                    <p className="text-sm font-bold text-foreground pl-6">
                      {format(
                        new Date(booking.showtime.start_time),
                        "dd/MM/yyyy",
                        { locale: vi },
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Giờ chiếu</span>
                    </div>
                    <p className="text-sm font-bold text-foreground pl-6">
                      {format(new Date(booking.showtime.start_time), "HH:mm")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Phòng</span>
                    </div>
                    <p className="text-sm font-bold text-foreground pl-6">
                      {booking.showtime.room.name}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Seats Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-sm">
                    Ghế đã chọn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {booking.selected_seats?.map((seat) => (
                      <Badge
                        key={seat.id}
                        variant="secondary"
                        className="opacity-50"
                      >
                        {seat.row}
                        {seat.column}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg opacity-50">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-bold">
                      Tổng tiền (chưa thanh toán):
                    </span>
                    <span className="text-muted-foreground font-bold text-xl line-through">
                      {booking.total_price.toLocaleString()} đ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/showtimes")}
                size="lg"
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Đặt vé lại
              </Button>
              <Button
                onClick={() => router.push("/movies")}
                variant="outline"
                size="lg"
                className="flex-1 gap-2"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
