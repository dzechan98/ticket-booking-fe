"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2 } from "lucide-react";

import { useListBookings } from "@/api/bookings/list";
import type { BookingStatus } from "@/api/bookings/type";
import { BasePagination } from "@/components/common/base-pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BookingStatusFilter = "all" | BookingStatus;

const bookingStatusOptions: Array<{
  value: BookingStatusFilter;
  label: string;
}> = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "pending", label: "Chờ thanh toán" },
  { value: "expired", label: "Hết hạn" },
  { value: "cancelled", label: "Đã hủy" },
];

const bookingStatusLabels: Record<BookingStatus, string> = {
  paid: "Đã thanh toán",
  pending: "Chờ thanh toán",
  expired: "Hết hạn",
  cancelled: "Đã hủy",
};

const bookingStatusBadgeClassNames: Record<BookingStatus, string> = {
  paid: "bg-emerald-600 text-white",
  pending: "bg-amber-500 text-white",
  expired: "bg-slate-500 text-white",
  cancelled: "bg-red-600 text-white",
};

const formatDateTime = (value: string | Date) => {
  try {
    return format(
      value instanceof Date ? value : new Date(value),
      "dd/MM/yyyy HH:mm",
      {
        locale: vi,
      },
    );
  } catch {
    return "Không hợp lệ";
  }
};

export function BookingManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>("all");

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const { data, isLoading } = useListBookings({
    page: currentPage,
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Quản lý booking
          </h1>
          <p className="text-muted-foreground">
            Theo dõi trạng thái booking, người đặt và suất chiếu trong hệ thống
          </p>
        </div>

        <div className="w-full lg:w-60">
          <p className="mb-2 text-sm font-medium text-foreground">
            Lọc theo trạng thái
          </p>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as BookingStatusFilter)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {bookingStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Danh sách booking</CardTitle>
          {data && (
            <p className="text-sm text-muted-foreground">
              Tổng cộng {data.total} booking
            </p>
          )}
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Không có booking nào phù hợp
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã booking</TableHead>
                    <TableHead>Người đặt</TableHead>
                    <TableHead>Phim / suất chiếu</TableHead>
                    <TableHead>Số ghế</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.items.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-45 truncate">
                          {booking.transaction_ref || booking.id}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-normal">
                        <div className="font-medium text-foreground">
                          {booking.user.full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.user.email}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-normal">
                        <div className="font-medium text-foreground">
                          {booking.showtime.movie.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(booking.showtime.start_time)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.showtime.room.name}
                        </div>
                      </TableCell>

                      <TableCell>
                        {booking.seat_ids?.length ?? booking.tickets.length} ghế
                      </TableCell>

                      <TableCell className="font-medium text-primary">
                        {booking.total_price.toLocaleString("vi-VN")} đ
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            bookingStatusBadgeClassNames[booking.status]
                          }
                        >
                          {bookingStatusLabels[booking.status]}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {formatDateTime(booking.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <BasePagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
