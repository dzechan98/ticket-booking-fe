"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paymentSchema, type PaymentInput } from "@/lib/validations/booking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentFormProps {
  totalPrice: number
  onSubmit: (data: PaymentInput) => void
}

export function PaymentForm({ totalPrice, onSubmit }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
  })

  const handlePayment = async (data: PaymentInput) => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(data)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
          {/* Price Summary */}
          <div className="bg-secondary p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-foreground">
              <span>Giá vé:</span>
              <span className="font-semibold">{totalPrice.toLocaleString()} đ</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-primary">{totalPrice.toLocaleString()} đ</span>
            </div>
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-foreground">
              Số thẻ (16 chữ số)
            </Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              {...register("cardNumber")}
            />
            {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-foreground">
                Ngày hết hạn
              </Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                maxLength={5}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                {...register("expiryDate")}
              />
              {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
            </div>

            {/* CVV */}
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-foreground">
                CVV
              </Label>
              <Input
                id="cvv"
                placeholder="123"
                maxLength={3}
                type="password"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                {...register("cvv")}
              />
              {errors.cvv && <p className="text-sm text-destructive">{errors.cvv.message}</p>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
          >
            {isProcessing ? "Đang xử lý..." : `Thanh toán ${totalPrice.toLocaleString()} đ`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Các thông tin thanh toán của bạn được bảo mật và mã hóa
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
