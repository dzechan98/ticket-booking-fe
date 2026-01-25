"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentFormProps {
  totalPrice: number;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function PaymentForm({
  totalPrice,
  onSubmit,
  isLoading = false,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Thanh toán</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-secondary p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-foreground">
              <span>Giá vé:</span>
              <span className="font-semibold">
                {totalPrice.toLocaleString()} đ
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-primary">
                {totalPrice.toLocaleString()} đ
              </span>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-foreground">
              Thông tin thanh toán
            </h3>
            <p className="text-sm text-muted-foreground">
              Vui lòng kiểm tra kỹ thông tin đặt vé trước khi thanh toán. Sau
              khi thanh toán thành công, vé sẽ được gửi về email của bạn.
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
          >
            {isProcessing || isLoading
              ? "Đang xử lý..."
              : `Thanh toán ${totalPrice.toLocaleString()} đ`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Các thông tin thanh toán của bạn được bảo mật và mã hóa
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
