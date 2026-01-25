"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SeatSelector } from "@/components/booking/seat-selector";
import { PaymentForm } from "@/components/booking/payment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, MapPin, Film, Armchair } from "lucide-react";
import { useShowtime } from "@/api/showtimes/detail";
import { useShowtimeSeats } from "@/api/showtimes/seats";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import type { PaymentInput } from "@/lib/validations/booking";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = params.id as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Fetch showtime details
  const { data: showtime, isLoading: isLoadingShowtime } =
    useShowtime(showtimeId);
  const { data: seatsData, isLoading: isLoadingSeats } =
    useShowtimeSeats(showtimeId);

  const steps = ["Chọn ghế", "Xác nhận & thanh toán"];

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seatsData?.seats.find((s) => s.id === seatId);
    return total + (seat?.final_price || 0);
  }, 0);

  const handleNext = () => {
    if (currentStep === 0 && selectedSeats.length === 0) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePayment = async (paymentData: PaymentInput) => {
    console.log("Payment submitted:", paymentData);
    // TODO: Process payment with showtime and seats
    alert("Đặt vé thành công! Chúc bạn xem phim vui vẻ!");
    router.push("/bookings");
  };

  if (isLoadingShowtime || isLoadingSeats) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              Đang tải thông tin suất chiếu...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!showtime || !seatsData) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-foreground">
              Không tìm thấy suất chiếu
            </p>
            <Button onClick={() => router.push("/showtimes")}>
              Quay lại danh sách
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const startTime = new Date(showtime.start_time);
  const endTime = new Date(showtime.end_time);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        {/* Movie Info Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-6">
              {/* Movie Poster */}
              <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-lg ring-2 ring-border shrink-0">
                <Image
                  src={showtime.movie.poster_url || "/placeholder-movie.jpg"}
                  alt={showtime.movie.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {showtime.movie.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {showtime.movie.genres?.map((genre: any) => (
                      <Badge
                        key={genre.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Showtime Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Ngày chiếu</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {format(startTime, "dd/MM/yyyy")}
                    </p>
                  </div>

                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Giờ chiếu</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                    </p>
                  </div>

                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Phòng</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {showtime.room.name}
                    </p>
                  </div>

                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Film className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Loại màn hình</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {showtime.room.screen_type}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Steps Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        index === currentStep
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : index < currentStep
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="ml-3 text-left">
                      <p
                        className={`text-sm font-semibold ${
                          index === currentStep
                            ? "text-primary"
                            : index < currentStep
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-16 mx-4 transition-all ${
                        index < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Choose Seats */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Armchair className="h-5 w-5 text-primary" />
                    Chọn ghế ngồi
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chọn ghế bạn muốn đặt. Ghế màu xám đã có người đặt.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <SeatSelector
                    showtimeId={showtimeId}
                    seats={seatsData.seats}
                    onSelectSeats={setSelectedSeats}
                    selectedSeats={selectedSeats}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Confirm & Payment */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <PaymentForm totalPrice={totalPrice} onSubmit={handlePayment} />
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-card border-border sticky top-24 shadow-lg">
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="text-foreground">
                      Thông tin đặt vé
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase">
                        Phim
                      </p>
                      <p className="font-bold text-foreground">
                        {showtime.movie.title}
                      </p>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase">
                          Ngày chiếu
                        </p>
                        <p className="font-semibold text-sm text-foreground">
                          {format(startTime, "dd/MM/yyyy", { locale: vi })}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase">
                          Giờ chiếu
                        </p>
                        <p className="font-semibold text-sm text-foreground">
                          {format(startTime, "HH:mm")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase">
                        Phòng chiếu
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-foreground">
                          {showtime.room.name}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {showtime.room.screen_type}
                        </Badge>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium uppercase">
                        Ghế đã chọn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map((seatId) => {
                          const seat = seatsData.seats.find(
                            (s) => s.id === seatId,
                          );
                          return (
                            <Badge
                              key={seatId}
                              variant="secondary"
                              className="font-semibold"
                            >
                              {seat?.row}
                              {seat?.column}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Số lượng ghế:
                        </span>
                        <span className="text-foreground font-bold">
                          {selectedSeats.length}
                        </span>
                      </div>

                      {selectedSeats.map((seatId) => {
                        const seat = seatsData.seats.find(
                          (s) => s.id === seatId,
                        );
                        return (
                          <div
                            key={seatId}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              Ghế {seat?.row}
                              {seat?.column} ({seat?.type}):
                            </span>
                            <span className="text-foreground font-semibold">
                              {seat?.final_price.toLocaleString()} đ
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t-2 border-border pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-bold text-lg">
                          Tổng cộng:
                        </span>
                        <span className="text-primary font-bold text-2xl">
                          {totalPrice.toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary bg-transparent px-8"
            >
              Quay lại
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={selectedSeats.length === 0}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg"
              >
                Tiếp theo
              </Button>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
