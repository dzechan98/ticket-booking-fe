"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { StepsIndicator } from "@/components/booking/steps-indicator"
import { ShowtimeSelector } from "@/components/booking/showtime-selector"
import { SeatSelector } from "@/components/booking/seat-selector"
import { PaymentForm } from "@/components/booking/payment-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PaymentInput } from "@/lib/validations/booking"

const SEAT_PRICE = 150000 // 150k per seat

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedShowtime, setSelectedShowtime] = useState<string>("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const steps = ["Chọn suất chiếu", "Chọn ghế", "Xác nhận & thanh toán"]

  const totalPrice = selectedSeats.length * SEAT_PRICE

  const handleNext = () => {
    if (currentStep === 0 && !selectedShowtime) return
    if (currentStep === 1 && selectedSeats.length === 0) return
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handlePayment = async (paymentData: PaymentInput) => {
    console.log("Payment submitted:", paymentData)
    // TODO: Process payment
    alert("Đặt vé thành công! Chúc bạn xem phim vui vẻ!")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Steps Indicator */}
          <StepsIndicator currentStep={currentStep} steps={steps} />

          {/* Step 1: Choose Showtime */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Chọn suất chiếu</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShowtimeSelector onSelect={setSelectedShowtime} selectedId={selectedShowtime} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Choose Seats */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <SeatSelector onSelectSeats={setSelectedSeats} selectedSeats={selectedSeats} />
            </div>
          )}

          {/* Step 3: Confirm & Payment */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <PaymentForm totalPrice={totalPrice} onSubmit={handlePayment} />
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-foreground">Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Phim</p>
                      <p className="font-semibold text-foreground">Phim Hành động Blockbuster</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Suất chiếu</p>
                      <p className="font-semibold text-foreground">12:00 PM - Rạp 2</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Ghế</p>
                      <p className="font-semibold text-foreground">{selectedSeats.sort().join(", ")}</p>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Số lượng:</span>
                        <span className="text-foreground font-semibold">{selectedSeats.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giá/vé:</span>
                        <span className="text-foreground font-semibold">{SEAT_PRICE.toLocaleString()} đ</span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="text-foreground font-bold">Tổng cộng:</span>
                        <span className="text-primary font-bold text-lg">{totalPrice.toLocaleString()} đ</span>
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
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Quay lại
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={(currentStep === 0 && !selectedShowtime) || (currentStep === 1 && selectedSeats.length === 0)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Tiếp theo
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
