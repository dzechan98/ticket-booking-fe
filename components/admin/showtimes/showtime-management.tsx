"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useShowtimes } from "@/api/showtimes/list";
import { Showtime, ShowtimeStatus } from "@/api/showtimes/type";
import { showtimeStatusLabels } from "@/lib/utils/enum-labels";
import { CreateShowtimeDialog } from "./create-showtime-dialog";
import { UpdateShowtimeDialog } from "./update-showtime-dialog";
import { DeleteShowtimeDialog } from "./delete-showtime-dialog";
import { BasePagination } from "@/components/common/base-pagination";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function ShowtimeManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null,
  );

  const { data, isLoading } = useShowtimes({ page: currentPage, limit: 10 });

  const handleEdit = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusEnum = status as ShowtimeStatus;
    switch (status) {
      case "UPCOMING":
        return (
          <Badge variant="default">{showtimeStatusLabels[statusEnum]}</Badge>
        );
      case "ONGOING":
        return (
          <Badge variant="secondary">{showtimeStatusLabels[statusEnum]}</Badge>
        );
      case "FINISHED":
        return (
          <Badge variant="outline">{showtimeStatusLabels[statusEnum]}</Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            {showtimeStatusLabels[statusEnum]}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý suất chiếu
          </h1>
          <p className="text-muted-foreground">
            Quản lý lịch chiếu phim trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm suất chiếu
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Danh sách suất chiếu</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Phòng chiếu</TableHead>
                <TableHead>Thời gian bắt đầu</TableHead>
                <TableHead>Thời gian kết thúc</TableHead>
                <TableHead>Giá vé</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Chưa có suất chiếu nào
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((showtime) => (
                  <TableRow key={showtime.id}>
                    <TableCell className="font-medium">
                      {showtime.movie.title}
                    </TableCell>
                    <TableCell>
                      {showtime.room.name}
                      <div className="text-xs text-muted-foreground">
                        {showtime.room.screen_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(showtime.start_time),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(showtime.end_time), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </TableCell>
                    <TableCell>
                      {showtime.base_price.toLocaleString()}đ
                    </TableCell>
                    <TableCell>{getStatusBadge(showtime.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(showtime)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(showtime)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {data && data.totalPages > 1 && (
            <BasePagination
              page={currentPage}
              totalPages={data.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      <CreateShowtimeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <UpdateShowtimeDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        showtime={selectedShowtime}
      />

      <DeleteShowtimeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        showtimeId={selectedShowtime?.id || null}
        showtimeName={
          selectedShowtime
            ? `${selectedShowtime.movie.title} - ${format(
                new Date(selectedShowtime.start_time),
                "dd/MM/yyyy HH:mm",
              )}`
            : ""
        }
      />
    </div>
  );
}
