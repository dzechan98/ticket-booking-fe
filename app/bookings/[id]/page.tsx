"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";

import { useMyBookingDetail } from "@/api/bookings/detail";
import type { BookingStatus } from "@/api/bookings/type";
import { useTickets } from "@/api/tickets/list";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const statusLabel: Record<BookingStatus, string> = {
  paid: "Đã thanh toán",
  pending: "Chờ thanh toán",
  cancelled: "Đã hủy",
  expired: "Hết hạn",
};

const statusClassName: Record<BookingStatus, string> = {
  paid: "bg-emerald-600 text-white",
  pending: "bg-amber-500 text-white",
  cancelled: "bg-red-600 text-white",
  expired: "bg-slate-500 text-white",
};

export default function BookingTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const {
    data: booking,
    isLoading: isBookingLoading,
    error: bookingError,
  } = useMyBookingDetail(bookingId);

  const shouldLoadTickets = booking?.status === "paid";
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    error: ticketsError,
  } = useTickets({
    booking_id: shouldLoadTickets ? bookingId : undefined,
    page: 1,
    limit: 100,
  });

  const displayedSeats = useMemo(() => {
    if (!booking) return [] as string[];

    if (booking.status === "paid") {
      if (ticketsData?.items?.length) {
        return ticketsData.items.map(
          (ticket) => `${ticket.seat.row}${ticket.seat.column}`,
        );
      }

      if (booking.tickets?.length) {
        return booking.tickets.map(
          (ticket) => `${ticket.seat.row}${ticket.seat.column}`,
        );
      }
    }

    if (booking.selected_seats?.length) {
      return booking.selected_seats.map((seat) => `${seat.row}${seat.column}`);
    }

    if (booking.tickets?.length) {
      return booking.tickets.map(
        (ticket) => `${ticket.seat.row}${ticket.seat.column}`,
      );
    }

    return [];
  }, [booking, ticketsData]);

  const displayedTickets = useMemo(() => {
    if (!booking) return [];

    if (ticketsData?.items?.length) {
      return ticketsData.items.map((ticket) => ({
        id: ticket.id,
        seatLabel: `${ticket.seat.row}${ticket.seat.column}`,
        price: ticket.price,
        qrCode: ticket.qr_code,
        usedAt: ticket.used_at,
        createdAt: ticket.created_at,
      }));
    }

    if (booking.tickets?.length) {
      return booking.tickets.map((ticket) => ({
        id: ticket.id,
        seatLabel: `${ticket.seat.row}${ticket.seat.column}`,
        price: ticket.price,
        qrCode: ticket.qr_code,
        usedAt: ticket.used_at,
        createdAt: booking.created_at,
      }));
    }

    return [];
  }, [booking, ticketsData]);

  if (isBookingLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="space-y-3 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Đang tải chi tiết booking...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="space-y-4 pt-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
              <h1 className="text-xl font-bold">Không tìm thấy booking</h1>
              <p className="text-muted-foreground">
                Booking có thể không tồn tại hoặc bạn không có quyền truy cập.
              </p>
              <Button onClick={() => router.push("/bookings")}>
                Quay lại lịch sử đặt vé
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-4 gap-2"
            onClick={() => router.push("/bookings")}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách booking
          </Button>

          <Card className="border-border">
            <CardHeader className="space-y-4 border-b">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Ticket className="h-6 w-6 text-primary" />
                    Chi tiết booking
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mã booking: {booking.transaction_ref || booking.id}
                  </p>
                </div>

                <Badge className={statusClassName[booking.status]}>
                  {statusLabel[booking.status]}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {booking.showtime.movie.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    Ngày chiếu
                  </div>
                  <p className="pl-6 text-sm font-semibold text-foreground">
                    {format(
                      new Date(booking.showtime.start_time),
                      "EEEE, dd/MM/yyyy",
                      {
                        locale: vi,
                      },
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Giờ chiếu
                  </div>
                  <p className="pl-6 text-sm font-semibold text-foreground">
                    {format(new Date(booking.showtime.start_time), "HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    Phòng
                  </div>
                  <p className="pl-6 text-sm font-semibold text-foreground">
                    {booking.showtime.room.name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                  Ghế
                </h3>

                {isTicketsLoading && shouldLoadTickets ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải vé từ ticket API...
                  </div>
                ) : displayedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayedSeats.map((seat) => (
                      <Badge
                        key={seat}
                        variant="secondary"
                        className="font-semibold"
                      >
                        {seat}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Booking hiện chưa có ticket hoặc chưa có dữ liệu ghế.
                  </p>
                )}

                {shouldLoadTickets && !!ticketsError && (
                  <p className="text-xs text-muted-foreground">
                    Không thể tải ticket API, đã dùng dữ liệu fallback từ
                    booking detail.
                  </p>
                )}
              </div>

              {displayedTickets.length > 0 && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">
                      Thông tin vé
                    </h3>

                    <div className="space-y-3">
                      {displayedTickets.map((ticket, index) => (
                        <div
                          key={ticket.id}
                          className="rounded-lg border border-border bg-card p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">
                              Vé #{index + 1} - Ghế {ticket.seatLabel}
                            </p>
                            <Badge
                              variant={ticket.usedAt ? "default" : "secondary"}
                            >
                              {ticket.usedAt ? "Đã sử dụng" : "Chưa sử dụng"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                            <p className="text-muted-foreground">
                              Mã QR:{" "}
                              <span className="font-medium text-foreground">
                                {ticket.qrCode}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Giá vé:{" "}
                              <span className="font-medium text-foreground">
                                {ticket.price.toLocaleString("vi-VN")} đ
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Tạo lúc:{" "}
                              <span className="font-medium text-foreground">
                                {format(
                                  new Date(ticket.createdAt),
                                  "HH:mm dd/MM/yyyy",
                                  {
                                    locale: vi,
                                  },
                                )}
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Dùng vé:{" "}
                              <span className="font-medium text-foreground">
                                {ticket.usedAt
                                  ? format(
                                      new Date(ticket.usedAt),
                                      "HH:mm dd/MM/yyyy",
                                      {
                                        locale: vi,
                                      },
                                    )
                                  : "Chưa check-in"}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Tổng thanh toán
                </span>
                <span className="text-xl font-bold text-primary">
                  {booking.total_price.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
