"use client";

import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOverviewStats } from "@/api/dashboard/overview";
import { useTopMovies } from "@/api/dashboard/top-movies";
import type { ChartPeriodType } from "@/api/dashboard/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function DashboardOverview() {
  const today = useMemo(() => new Date(), []);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriodType>("day");
  const [chartRange, setChartRange] = useState<DateRange | undefined>({
    from: addDays(today, -29),
    to: today,
  });

  const { data: overviewData, isLoading: isLoadingOverview } =
    useOverviewStats();
  const { data: topMoviesData, isLoading: isLoadingTopMovies } = useTopMovies({
    limit: 5,
  });

  const stats = overviewData?.data;
  const topMovies = topMoviesData?.data || [];

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("vi-VN");
  };

  const chartQueryRange = useMemo(() => {
    if (!chartRange?.from || !chartRange?.to) {
      return {
        startDate: format(addDays(today, -29), "yyyy-MM-dd"),
        endDate: format(today, "yyyy-MM-dd"),
      };
    }

    return {
      startDate: format(chartRange.from, "yyyy-MM-dd"),
      endDate: format(chartRange.to, "yyyy-MM-dd"),
    };
  }, [chartRange, today]);

  const rangeText =
    chartRange?.from && chartRange?.to
      ? `${format(chartRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(chartRange.to, "dd/MM/yyyy", { locale: vi })}`
      : "Chọn khoảng thời gian";

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Tổng vé bán ra"
          value={
            isLoadingOverview
              ? "..."
              : formatNumber(stats?.totalTicketsSold || 0)
          }
          description="Tất cả thời gian"
          icon="🎫"
          color="primary"
        />
        <StatCard
          title="Doanh thu"
          value={
            isLoadingOverview
              ? "..."
              : `${formatCurrency(stats?.totalRevenue || 0)} VNĐ`
          }
          description="Từ tất cả vé"
          icon="💰"
          color="green"
        />
        <StatCard
          title="Người dùng"
          value={
            isLoadingOverview ? "..." : formatNumber(stats?.totalUsers || 0)
          }
          description="Tài khoản đã đăng ký"
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Phim đang chiếu"
          value={isLoadingOverview ? "..." : stats?.totalMoviesShowing || 0}
          description="Phim hiện tại"
          icon="🎬"
          color="accent"
        />
        <StatCard
          title="Phòng chiếu"
          value={isLoadingOverview ? "..." : stats?.totalRooms || 0}
          description="Tổng số phòng"
          icon="🏛️"
          color="primary"
        />
        <StatCard
          title="Suất chiếu hôm nay"
          value={isLoadingOverview ? "..." : stats?.totalShowtimesToday || 0}
          description="Trong ngày"
          icon="📅"
          color="blue"
        />
      </div>

      {/* Revenue Chart */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Khoảng thời gian doanh thu
            </p>
            <p className="text-xs text-muted-foreground">
              Dữ liệu được lọc theo khoảng ngày bạn chọn
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Select
              value={chartPeriod}
              onValueChange={(value) =>
                setChartPeriod(value as ChartPeriodType)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Chọn period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Ngày</SelectItem>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal sm:w-72.5",
                    !chartRange?.from && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {rangeText}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={chartRange}
                  onSelect={setChartRange}
                  numberOfMonths={2}
                  disabled={(date) => date > today}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <RevenueChart
          period={chartPeriod}
          startDate={chartQueryRange.startDate}
          endDate={chartQueryRange.endDate}
          rangeLabel={rangeText}
        />
      </div>

      {/* Top Movies */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Top phim bán chạy nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTopMovies ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : topMovies.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chưa có dữ liệu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="relative w-16 h-20 rounded overflow-hidden shrink-0">
                      <Image
                        src={movie.posterUrl ?? ""}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(movie.ticketsSold)} vé
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ {movie.rating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatCurrency(movie.revenue)} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
