"use client";

import { StatCard } from "@/components/admin/stat-card";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOverviewStats } from "@/api/dashboard/overview";
import { useTopMovies } from "@/api/dashboard/top-movies";
import Image from "next/image";

export function DashboardOverview() {
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
      <RevenueChart period="day" days={7} />

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
                        src={movie.posterUrl}
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
