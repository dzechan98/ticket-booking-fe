"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingCard } from "@/components/bookings/booking-card";
import { Input } from "@/components/ui/input";
import { Search, Ticket, Loader2 } from "lucide-react";
import { useMyBookings } from "@/api/bookings/list";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { BasePagination } from "@/components/common/base-pagination";

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user's bookings
  const { data, isLoading, error } = useMyBookings({
    page: currentPage,
    limit: 10,
  });

  // Filter bookings by search query
  const filteredBookings = useMemo(() => {
    if (!data?.items) return [];

    if (!searchQuery) return data.items;

    return data.items.filter(
      (booking) =>
        booking.showtime.movie.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Lịch sử đặt vé
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tất cả các vé đã thanh toán của bạn
                </p>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tổng vé</p>
                    <p className="text-xl font-bold text-primary">
                      {data?.total || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên phim hoặc mã vé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">
                  Đang tải danh sách vé...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">
                Có lỗi xảy ra khi tải danh sách vé
              </p>
            </div>
          )}

          {/* Bookings List */}
          {!isLoading && !error && (
            <>
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      id={booking.id}
                      movieTitle={booking.showtime.movie.title}
                      showtime={`${format(new Date(booking.showtime.start_time), "dd/MM/yyyy - HH:mm", { locale: vi })} - ${booking.showtime.room.name}`}
                      seats={booking.tickets.map(
                        (t) => `${t.seat.row}${t.seat.column}`,
                      )}
                      totalPrice={booking.total_price}
                      posterUrl={booking.showtime.movie.poster_url || ""}
                      paymentMethod="Thanh toán online"
                      paymentTime={format(
                        new Date(booking.paid_at),
                        "dd/MM/yyyy - HH:mm",
                        { locale: vi },
                      )}
                      bookingCode={booking.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không có vé nào
                  </p>
                </div>
              )}

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-8">
                  <BasePagination
                    page={currentPage}
                    totalPages={data.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
