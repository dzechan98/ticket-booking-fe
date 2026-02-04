"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Film,
  Ticket,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useMyBookingDetail } from "@/api/bookings/detail";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data: booking, isLoading, error } = useMyBookingDetail(bookingId);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              Đang tải thông tin đặt vé...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-bold text-foreground">
                Không tìm thấy booking
              </h2>
              <p className="text-muted-foreground">
                Vui lòng kiểm tra lại mã đặt vé hoặc liên hệ hỗ trợ
              </p>
              <Button onClick={() => router.push("/bookings")}>
                Xem lịch sử đặt vé
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const startTime = new Date(booking.showtime.start_time);
  const endTime = new Date(booking.showtime.end_time);
  const paidAt = booking.paid_at ? new Date(booking.paid_at) : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 bg-linear-to-b from-green-50/50 via-background to-background dark:from-green-950/10">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Thanh toán thành công! 🎉
            </h1>
            <p className="text-muted-foreground text-lg">
              Vé của bạn đã được đặt thành công. Cảm ơn bạn đã sử dụng dịch vụ!
            </p>
          </div>

          {/* Booking Info Card */}
          <Card className="mb-6 shadow-lg border-green-200 dark:border-green-900">
            <CardHeader className="border-b">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Ticket className="h-5 w-5 text-green-600" />
                Thông tin đặt vé
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Movie Info */}
              <div className="flex gap-4">
                <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-md ring-2 ring-border shrink-0">
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
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {booking.showtime.movie.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">
                        Mã: {booking.transaction_ref}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Đã thanh toán
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Showtime Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Ngày chiếu</span>
                  </div>
                  <p className="text-sm font-bold text-foreground pl-6">
                    {format(startTime, "EEEE, dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Giờ chiếu</span>
                  </div>
                  <p className="text-sm font-bold text-foreground pl-6">
                    {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Phòng chiếu</span>
                  </div>
                  <p className="text-sm font-bold text-foreground pl-6">
                    {booking.showtime.room.name}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Film className="h-4 w-4 text-primary" />
                    <span className="font-medium">Thanh toán lúc</span>
                  </div>
                  <p className="text-sm font-bold text-foreground pl-6">
                    {paidAt
                      ? format(paidAt, "HH:mm, dd/MM/yyyy", { locale: vi })
                      : "-"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Seats & Price */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Ghế đã đặt</h3>
                <div className="flex flex-wrap gap-2">
                  {booking.tickets.map((ticket) => (
                    <Badge
                      key={ticket.id}
                      variant="secondary"
                      className="text-sm font-semibold px-3 py-1"
                    >
                      {ticket.seat.row}
                      {ticket.seat.column}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-bold text-lg">
                    Tổng thanh toán:
                  </span>
                  <span className="text-green-600 dark:text-green-500 font-bold text-2xl">
                    {booking.total_price.toLocaleString()} đ
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              In vé
            </Button>
            <Button
              onClick={() => router.push("/bookings")}
              size="lg"
              className="gap-2"
            >
              <Ticket className="h-4 w-4" />
              Xem lịch sử đặt vé
            </Button>
            <Button
              onClick={() => router.push("/movies")}
              variant="secondary"
              size="lg"
            >
              Đặt vé khác
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
