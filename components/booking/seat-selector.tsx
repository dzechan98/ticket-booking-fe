"use client";

import { ShowtimeSeat } from "@/api/showtimes/type";
import { seatTypeLabels } from "@/lib/utils/enum-labels";
import { useEffect, useMemo, useState } from "react";

type SeatStatus = "available" | "selected" | "booked";

interface SeatSelectorProps {
  showtimeId: string;
  seats: ShowtimeSeat[];
  onSelectSeats: (seatIds: string[]) => void;
  selectedSeats?: string[];
}

export function SeatSelector({
  showtimeId,
  seats,
  onSelectSeats,
  selectedSeats = [],
}: SeatSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedSeats));

  useEffect(() => {
    setSelected(new Set(selectedSeats));
  }, [selectedSeats]);

  const toggleSeat = (seatId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelected(newSelected);
    onSelectSeats(Array.from(newSelected));
  };

  const getSeatStatus = (seat: ShowtimeSeat): SeatStatus => {
    if (seat.is_booked) return "booked";
    if (selected.has(seat.id)) return "selected";
    return "available";
  };

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped = new Map<string, ShowtimeSeat[]>();
    seats.forEach((seat) => {
      if (!grouped.has(seat.row)) {
        grouped.set(seat.row, []);
      }
      grouped.get(seat.row)?.push(seat);
    });
    // Sort seats in each row by column
    grouped.forEach((row) => row.sort((a, b) => a.column - b.column));
    return grouped;
  }, [seats]);

  // Get sorted rows
  const rows = useMemo(
    () => Array.from(seatsByRow.keys()).sort(),
    [seatsByRow],
  );

  const getSeatTypeColor = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-purple-600 hover:bg-purple-700 border-purple-400";
      case "COUPLE":
        return "bg-pink-600 hover:bg-pink-700 border-pink-400";
      default:
        return "bg-green-600 hover:bg-green-700 border-green-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm justify-center bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-600 border-2 border-green-400" />
          <span className="text-foreground font-medium">Thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-purple-600 border-2 border-purple-400" />
          <span className="text-foreground font-medium">
            {seatTypeLabels.VIP}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-pink-600 border-2 border-pink-400" />
          <span className="text-foreground font-medium">
            {seatTypeLabels.COUPLE}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary border-2 border-primary" />
          <span className="text-foreground font-medium">Đã chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-muted border-2 border-border" />
          <span className="text-muted-foreground font-medium">Đã đặt</span>
        </div>
      </div>

      {/* Screen */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="px-32 py-3 bg-gradient-to-b from-muted to-muted/50 border-2 border-border rounded-t-3xl text-foreground font-bold text-lg shadow-lg">
            MÀN HÌNH
          </div>
          <div className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      {/* Seats Grid */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {rows.map((row) => {
          const rowSeats = seatsByRow.get(row) || [];
          return (
            <div key={row} className="flex items-center gap-3 justify-center">
              <span className="w-8 font-bold text-foreground text-center text-lg">
                {row}
              </span>
              <div className="flex gap-2">
                {rowSeats.map((seat) => {
                  const status = getSeatStatus(seat);
                  const isBooked = status === "booked";
                  const isSelected = status === "selected";
                  const seatColor = isSelected
                    ? "bg-primary border-primary"
                    : isBooked
                      ? "bg-muted border-border"
                      : getSeatTypeColor(seat.type);

                  return (
                    <button
                      key={seat.id}
                      onClick={() => !isBooked && toggleSeat(seat.id)}
                      disabled={isBooked}
                      className={`
                        w-10 h-10 rounded-lg text-xs font-bold transition-all border-2
                        ${seatColor}
                        ${isSelected ? "text-primary-foreground ring-4 ring-primary/30 scale-110" : ""}
                        ${isBooked ? "text-muted-foreground cursor-not-allowed opacity-50" : "text-white cursor-pointer hover:scale-110"}
                        ${!isBooked && !isSelected ? "hover:shadow-lg" : ""}
                      `}
                      title={`${seat.row}${seat.column} - ${seat.type} - ${seat.final_price.toLocaleString()}đ`}
                    >
                      {seat.column}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Seats Summary */}
      {selected.size > 0 && (
        <div className="mt-6 p-5 bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-foreground font-bold text-lg">
                Ghế đã chọn:{" "}
                <span className="text-primary">{selected.size}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(selected)
                  .sort()
                  .map((seatId) => {
                    const seat = seats.find((s) => s.id === seatId);
                    return (
                      <span
                        key={seatId}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md font-semibold text-sm"
                      >
                        {seat?.row}
                        {seat?.column}
                      </span>
                    );
                  })}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium">
                Tổng tiền tạm tính
              </p>
              <p className="text-2xl font-bold text-primary">
                {Array.from(selected)
                  .reduce((total, seatId) => {
                    const seat = seats.find((s) => s.id === seatId);
                    return total + (seat?.final_price || 0);
                  }, 0)
                  .toLocaleString()}
                đ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
