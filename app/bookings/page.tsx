"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BookingCard } from "@/components/bookings/booking-card"
import { Button } from "@/components/ui/button"

const mockBookings = [
  {
    id: "1",
    movieTitle: "Phim Hành động Blockbuster",
    showtime: "01/02/2026 - 12:00 PM - Rạp 2",
    seats: ["A5", "A6"],
    totalPrice: 300000,
    status: "paid" as const,
    posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  },
  {
    id: "2",
    movieTitle: "Phim Tình cảm Lãng mạn",
    showtime: "28/01/2026 - 06:00 PM - Rạp 1",
    seats: ["B3", "B4", "B5"],
    totalPrice: 450000,
    status: "watched" as const,
    posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  },
  {
    id: "3",
    movieTitle: "Phim Kinh dị Rợn người",
    showtime: "20/01/2026 - 09:00 PM - Rạp 3",
    seats: ["C2"],
    totalPrice: 150000,
    status: "cancelled" as const,
    posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  },
]

export default function BookingsPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "watched" | "cancelled">("all")

  const filteredBookings = filterStatus === "all" ? mockBookings : mockBookings.filter((b) => b.status === filterStatus)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Lịch sử đặt vé</h1>
            <p className="text-muted-foreground">Xem tất cả các vé đã đặt của bạn</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["all", "paid", "watched", "cancelled"].map((status) => (
              <Button
                key={status}
                onClick={() => setFilterStatus(status as typeof filterStatus)}
                variant={filterStatus === status ? "default" : "outline"}
                className={`${
                  filterStatus === status
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                {status === "all"
                  ? "Tất cả"
                  : status === "paid"
                    ? "Đã thanh toán"
                    : status === "watched"
                      ? "Đã xem"
                      : "Đã hủy"}
              </Button>
            ))}
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
  )
}
