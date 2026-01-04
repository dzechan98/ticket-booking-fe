"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ROWS = 8
const SEATS_PER_ROW = 10

type SeatStatus = "available" | "selected" | "booked"

interface SeatSelectorProps {
  onSelectSeats: (seats: string[]) => void
  selectedSeats?: string[]
}

export function SeatSelector({ onSelectSeats, selectedSeats = [] }: SeatSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedSeats))

  const toggleSeat = (seatId: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId)
    } else {
      newSelected.add(seatId)
    }
    setSelected(newSelected)
    onSelectSeats(Array.from(newSelected))
  }

  const getSeatStatus = (seatId: string): SeatStatus => {
    // Mock: some seats are booked
    const bookedSeats = ["A5", "A6", "B3", "B8", "C1", "C2"]
    if (bookedSeats.includes(seatId)) return "booked"
    if (selected.has(seatId)) return "selected"
    return "available"
  }

  const rows = Array.from({ length: ROWS }, (_, i) => String.fromCharCode(65 + i))

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Chọn ghế</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-6 text-sm justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600" />
              <span className="text-foreground">Có sẵn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-foreground">Đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">Đã đặt</span>
            </div>
          </div>

          {/* Screen */}
          <div className="text-center mb-8">
            <div className="inline-block px-8 py-2 bg-secondary border-2 border-border rounded text-foreground font-semibold">
              MÀNG HÌNH
            </div>
          </div>

          {/* Seats Grid */}
          <div className="space-y-3 max-w-2xl mx-auto">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-2 justify-center">
                <span className="w-6 font-semibold text-foreground text-center">{row}</span>
                <div className="flex gap-2">
                  {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                    const seatId = `${row}${i + 1}`
                    const status = getSeatStatus(seatId)

                    return (
                      <button
                        key={seatId}
                        onClick={() => status !== "booked" && toggleSeat(seatId)}
                        disabled={status === "booked"}
                        className={`w-8 h-8 rounded text-xs font-semibold transition-all ${
                          status === "available"
                            ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                            : status === "selected"
                              ? "bg-primary text-primary-foreground cursor-pointer ring-2 ring-primary"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                        title={seatId}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Seats Summary */}
          {selected.size > 0 && (
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="text-foreground font-semibold">Ghế đã chọn ({selected.size}):</p>
              <p className="text-muted-foreground mt-2">{Array.from(selected).sort().join(", ")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
