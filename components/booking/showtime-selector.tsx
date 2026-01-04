"use client"
import { Badge } from "@/components/ui/badge"

interface Showtime {
  id: string
  date: string
  time: string
  room: string
  availableSeats: number
}

const showtimes: Showtime[] = [
  { id: "1", date: "01/02/2026", time: "09:00 AM", room: "Rạp 1", availableSeats: 45 },
  { id: "2", date: "01/02/2026", time: "12:00 PM", room: "Rạp 2", availableSeats: 12 },
  { id: "3", date: "01/02/2026", time: "03:00 PM", room: "Rạp 1", availableSeats: 0 },
  { id: "4", date: "01/02/2026", time: "06:00 PM", room: "Rạp 3", availableSeats: 28 },
  { id: "5", date: "02/02/2026", time: "09:00 AM", room: "Rạp 1", availableSeats: 50 },
  { id: "6", date: "02/02/2026", time: "12:00 PM", room: "Rạp 2", availableSeats: 35 },
]

interface ShowtimeSelectorProps {
  onSelect: (showtimeId: string) => void
  selectedId?: string
}

export function ShowtimeSelector({ onSelect, selectedId }: ShowtimeSelectorProps) {
  const groupedShowtimes = showtimes.reduce(
    (acc, showtime) => {
      const existing = acc.find((g) => g.date === showtime.date)
      if (existing) {
        existing.times.push(showtime)
      } else {
        acc.push({ date: showtime.date, times: [showtime] })
      }
      return acc
    },
    [] as { date: string; times: Showtime[] }[],
  )

  return (
    <div className="space-y-6">
      {groupedShowtimes.map((group) => (
        <div key={group.date}>
          <h3 className="font-semibold text-foreground mb-3">{group.date}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.times.map((showtime) => (
              <button
                key={showtime.id}
                onClick={() => showtime.availableSeats > 0 && onSelect(showtime.id)}
                disabled={showtime.availableSeats === 0}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedId === showtime.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border hover:border-primary"
                } ${showtime.availableSeats === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="font-semibold text-lg">{showtime.time}</div>
                <div className="text-sm text-muted-foreground">{showtime.room}</div>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${
                    showtime.availableSeats > 0
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {showtime.availableSeats > 0 ? `${showtime.availableSeats} ghế trống` : "Hết chỗ"}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
