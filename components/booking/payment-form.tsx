"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Shield, Clock } from "lucide-react";

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
  const handlePayment = () => {
    onSubmit();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Thanh toán qua VNPay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* VNPay Info */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" rx="10" fill="#0066CC" />
                  <path
                    d="M25 50L35 60L55 40"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M65 35V65M75 35V65"
                    stroke="white"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Cổng thanh toán VNPay
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hỗ trợ thanh toán qua thẻ ATM, Visa, Mastercard, JCB, Ví điện
                  tử
                </p>
              </div>
            </div>
          </div>

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

          {/* Important Notes */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                <span className="font-semibold text-amber-600">Lưu ý:</span> Bạn
                có <span className="font-bold text-foreground">5 phút</span> để
                hoàn tất thanh toán. Ghế sẽ tự động được giải phóng nếu hết thời
                gian.
              </p>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Shield className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Thông tin thanh toán được bảo mật và mã hóa theo tiêu chuẩn quốc
                tế
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              `Thanh toán ${totalPrice.toLocaleString()} đ`
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Bằng việc nhấn thanh toán, bạn đồng ý với{" "}
            <a href="/terms" className="text-primary hover:underline">
              điều khoản sử dụng
            </a>{" "}
            của chúng tôi
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
