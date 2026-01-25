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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>("");

  // Prepare filters
  const filters = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };

    if (selectedDate) {
      params.date = selectedDate;
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

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Lịch chiếu phim
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tìm suất chiếu phù hợp và đặt vé ngay
                </p>
              </div>
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tổng suất chiếu
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {data?.total || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Chọn ngày:
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedDate === "" ? "default" : "outline"}
                    onClick={() => {
                      setSelectedDate("");
                      setCurrentPage(1);
                    }}
                    className="h-8 text-xs"
                  >
                    Tất cả
                  </Button>
                  {availableDates.map((date) => (
                    <Button
                      key={date}
                      size="sm"
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDate(date);
                        setCurrentPage(1);
                      }}
                      className="h-8 text-xs"
                    >
                      {format(new Date(date), "dd/MM", { locale: vi })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Trạng thái:
                </span>
                <Select
                  value={status || "ALL"}
                  onValueChange={(value) => {
                    setStatus(value === "ALL" ? "" : value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-35 h-8 text-xs">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="UPCOMING">Sắp chiếu</SelectItem>
                    <SelectItem value="ONGOING">Đang chiếu</SelectItem>
                    <SelectItem value="FINISHED">Đã chiếu</SelectItem>
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
                <div className="space-y-6">
                  {filteredShowtimes.map((showtime) => (
                    <ShowtimeCard key={showtime.id} showtime={showtime} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy suất chiếu nào
                  </p>
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
