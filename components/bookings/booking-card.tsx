import { Button } from "@/components/ui/button";
import { Calendar, MapPin, CreditCard, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface BookingCardProps {
  movieTitle: string;
  showtime: string;
  seats: string[];
  totalPrice: number;
  posterUrl: string;
  paymentMethod?: string;
  paymentTime?: string;
  bookingCode?: string;
}

export function BookingCard({
  movieTitle,
  showtime,
  seats,
  totalPrice,
  posterUrl,
  paymentMethod,
  paymentTime,
  bookingCode,
}: BookingCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (bookingCode) {
      navigator.clipboard.writeText(bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Movie Poster */}
        <div className="md:col-span-1">
          <div className="relative w-full h-36 md:h-full rounded-md overflow-hidden">
            <img
              src={posterUrl || "/placeholder.svg"}
              alt={movieTitle}
              className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Booking Details */}
        <div className="md:col-span-2 space-y-3">
          <div>
            <h3 className="font-bold text-base text-foreground mb-0.5 line-clamp-1">
              {movieTitle}
            </h3>
            {bookingCode && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Mã:</span>
                <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">
                  {bookingCode}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                  ) : (
                    <Copy className="h-2.5 w-2.5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  {showtime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {seats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-semibold"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {paymentMethod && (
              <div className="flex items-start gap-2">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-xs">
                    {paymentMethod}
                  </p>
                  {paymentTime && (
                    <p className="text-xs text-muted-foreground">
                      {paymentTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className="md:col-span-1 flex flex-col justify-between items-start md:items-end">
          <div className="text-left md:text-right">
            <p className="text-xs text-muted-foreground mb-0.5">
              Tổng thanh toán
            </p>
            <p className="text-xl font-bold text-primary">
              {totalPrice.toLocaleString()}
              <span className="text-sm">đ</span>
            </p>
            <p className="text-xs text-muted-foreground">{seats.length} vé</p>
          </div>
        </div>
      </div>
    </div>
  );
}
