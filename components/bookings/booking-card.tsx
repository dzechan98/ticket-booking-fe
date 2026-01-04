import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BookingCardProps {
  id: string
  movieTitle: string
  showtime: string
  seats: string[]
  totalPrice: number
  status: "paid" | "watched" | "cancelled"
  posterUrl: string
}

const statusConfig = {
  paid: { label: "Đã thanh toán", color: "bg-green-600 text-white" },
  watched: { label: "Đã xem", color: "bg-blue-600 text-white" },
  cancelled: { label: "Đã hủy", color: "bg-red-600 text-white" },
}

export function BookingCard({ id, movieTitle, showtime, seats, totalPrice, status, posterUrl }: BookingCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Movie Poster */}
        <div className="md:col-span-1">
          <img src={posterUrl || "/placeholder.svg"} alt={movieTitle} className="w-full h-40 object-cover rounded" />
        </div>

        {/* Booking Details */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground line-clamp-2">{movieTitle}</h3>
            <p className="text-sm text-muted-foreground">{showtime}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Ghế:</p>
            <p className="font-semibold text-foreground">{seats.join(", ")}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={statusConfig[status].color}>{statusConfig[status].label}</Badge>
          </div>
        </div>

        {/* Price and Action */}
        <div className="md:col-span-1 flex flex-col justify-between items-end">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tổng cộng</p>
            <p className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} đ</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-secondary bg-transparent"
          >
            Chi tiết
          </Button>
        </div>
      </div>
    </div>
  )
}
