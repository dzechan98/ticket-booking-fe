"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShowtimeCard } from "@/components/showtimes/showtime-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Film, Loader2 } from "lucide-react";
import { useShowtimes } from "@/api/showtimes/list";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BasePagination } from "@/components/common/base-pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ShowtimesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>("");

  // Prepare filters
  const filters = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 12,
    };

    if (selectedDate) {
      params.start_time = selectedDate;
    }

    if (status) {
      params.status = status;
    }

    return params;
  }, [currentPage, selectedDate, status]);

  const { data, isLoading, error } = useShowtimes(filters);

  // Filter by search query on client side
  const filteredShowtimes = useMemo(() => {
    if (!data?.items) return [];

    if (!searchQuery) return data.items;

    console.log(1);

    return data.items.filter((showtime) =>
      showtime.movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  // Get available dates (next 7 days)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(format(date, "yyyy-MM-dd"));
    }
    return dates;
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  <Film className="h-3.5 w-3.5" />
                  <span>Đặt vé nhanh chóng</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Lịch chiếu phim
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Tìm suất chiếu phù hợp và đặt vé ngay hôm nay. Trải nghiệm
                  điện ảnh đỉnh cao với hệ thống rạp hiện đại.
                </p>
              </div>
              <div className="bg-card border border-border shadow-lg px-6 py-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Film className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Tổng suất chiếu
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {data?.total || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8 bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Tìm kiếm phim
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nhập tên phim bạn muốn xem..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 text-sm border-border focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Filters */}
            <div className="space-y-5">
              {/* Date Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Chọn ngày chiếu
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((date) => (
                    <Button
                      key={date}
                      size="sm"
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDate(date);
                        setCurrentPage(1);
                      }}
                      className="h-10 px-4 rounded-lg font-medium transition-all"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs opacity-75">
                          {format(new Date(date), "EEE", { locale: vi })}
                        </span>
                        <span className="font-bold">
                          {format(new Date(date), "dd/MM")}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Trạng thái suất chiếu
                </label>
                <Select
                  value={status || "ALL"}
                  onValueChange={(value) => {
                    setStatus(value === "ALL" ? "" : value);

                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-64 h-11 border-border focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                    <SelectItem value="UPCOMING"> Sắp chiếu</SelectItem>
                    <SelectItem value="ONGOING"> Đang chiếu</SelectItem>
                    <SelectItem value="FINISHED"> Đã chiếu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
              </AlertDescription>
            </Alert>
          )}

          {/* Showtimes List */}
          {!isLoading && !error && (
            <>
              {filteredShowtimes.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {filteredShowtimes.length} suất chiếu
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {filteredShowtimes.map((showtime) => (
                      <ShowtimeCard key={showtime.id} showtime={showtime} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-card border border-border rounded-xl">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-muted p-6 rounded-full">
                      <Film className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground mb-1">
                        Không tìm thấy suất chiếu
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vui lòng thử lại với bộ lọc khác
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-8">
                  <BasePagination
                    page={currentPage}
                    totalPages={data.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
