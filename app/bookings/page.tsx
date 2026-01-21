"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BookingCard } from "@/components/bookings/booking-card";
import { Input } from "@/components/ui/input";
import { Search, Ticket } from "lucide-react";

const mockBookings = [
  {
    id: "1",
    movieTitle: "MAI - Trấn Thành",
    showtime: "25/01/2026 - 19:30 - Rạp 1",
    seats: ["A5", "A6"],
    totalPrice: 300000,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    paymentMethod: "Thanh toán online",
    paymentTime: "25/01/2026 - 15:20",
    bookingCode: "BK2026012500001",
  },
  {
    id: "2",
    movieTitle: "Doraemon: Nobita và Bản Giao Hưởng Địa Cầu",
    showtime: "23/01/2026 - 14:00 - Rạp 3",
    seats: ["B3", "B4", "B5"],
    totalPrice: 450000,
    posterUrl: "https://i.ytimg.com/vi/OohVWM1u6rU/maxresdefault.jpg",
    paymentMethod: "Thanh toán online",
    paymentTime: "22/01/2026 - 10:15",
    bookingCode: "BK2026012200002",
  },
  {
    id: "3",
    movieTitle: "Cám - Nguyễn Phi Vân",
    showtime: "20/01/2026 - 21:00 - Rạp 5",
    seats: ["C2"],
    totalPrice: 150000,
    posterUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfbzsZy0Vw0Kqx6Rh7Q3sZlVQiGbmLZ1xQIg&s",
    paymentMethod: "Thanh toán online",
    paymentTime: "20/01/2026 - 18:00",
    bookingCode: "BK2026012000003",
  },
  {
    id: "4",
    movieTitle: "Avengers: Endgame",
    showtime: "18/01/2026 - 20:00 - Rạp 2",
    seats: ["D5", "D6", "D7", "D8"],
    totalPrice: 600000,
    posterUrl:
      "https://lumiere-a.akamaihd.net/v1/images/p_avengersendgame_19751_e14a0104.jpeg",
    paymentMethod: "Thanh toán online",
    paymentTime: "17/01/2026 - 18:30",
    bookingCode: "BK2026011700004",
  },
  {
    id: "5",
    movieTitle: "Spider-Man: No Way Home",
    showtime: "15/01/2026 - 16:30 - Rạp 4",
    seats: ["E10", "E11"],
    totalPrice: 280000,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
    paymentMethod: "Thanh toán online",
    paymentTime: "15/01/2026 - 12:00",
    bookingCode: "BK2026011500005",
  },
  {
    id: "6",
    movieTitle: "Oppenheimer",
    showtime: "30/01/2026 - 20:30 - Rạp 1",
    seats: ["F5", "F6"],
    totalPrice: 320000,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
    paymentMethod: "Thanh toán online",
    paymentTime: "29/01/2026 - 14:45",
    bookingCode: "BK2026012900006",
  },
];

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
                      {mockBookings.length}
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

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} {...booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Không có vé nào</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
