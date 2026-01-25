"use client";

import type { SeatResponse } from "@/api/seats/type";
import { SeatType } from "@/api/seats/type";
import { BasePagination } from "@/components/common/base-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CreateSeatInput, UpdateSeatInput } from "@/lib/validations/seat";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { SeatForm } from "./seat-form";
import { BulkSeatForm } from "./bulk-seat-form";
import type { CreateMultipleSeatsInput } from "@/lib/validations/seat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SeatsListProps {
  seats: SeatResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  isCreateOpen: boolean;
  isBulkCreateOpen: boolean;
  rooms?: Array<{ id: string; name: string }>;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: (data: CreateSeatInput) => Promise<void>;
  onUpdate: (id: string, data: UpdateSeatInput) => Promise<void>;
  onBulkCreate: (data: CreateMultipleSeatsInput) => Promise<void>;
  onCreateOpenChange: (open: boolean) => void;
  onBulkCreateOpenChange: (open: boolean) => void;
}

export const seatTypeConfig: Record<
  SeatType,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  [SeatType.NORMAL]: {
    label: "Tiêu chuẩn",
    variant: "secondary",
  },
  [SeatType.VIP]: {
    label: "VIP",
    variant: "default",
  },
  [SeatType.COUPLE]: {
    label: "Ghế đôi",
    variant: "destructive",
  },
};

export function SeatsList({
  page,
  totalPages,
  seats,
  isLoading,
  isCreateOpen,
  isBulkCreateOpen,
  rooms = [],
  onDelete,
  onCreate,
  onUpdate,
  onBulkCreate,
  onPageChange,
  onCreateOpenChange,
  onBulkCreateOpenChange,
}: SeatsListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<SeatResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [deleteSeatId, setDeleteSeatId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (seat: SeatResponse) => {
    setSelectedSeat(seat);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = async (data: CreateSeatInput) => {
    setIsCreating(true);
    try {
      await onCreate(data);
      onCreateOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubmit = async (data: UpdateSeatInput) => {
    if (!selectedSeat) return;

    setIsUpdating(true);
    try {
      await onUpdate(selectedSeat.id, data);
      setIsEditOpen(false);
      setSelectedSeat(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkCreateSubmit = async (data: CreateMultipleSeatsInput) => {
    setIsBulkCreating(true);
    try {
      await onBulkCreate(data);
      onBulkCreateOpenChange(false);
    } finally {
      setIsBulkCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSeatId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteSeatId);
      setDeleteSeatId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Danh sách ghế ngồi</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : seats.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Chưa có ghế ngồi nào
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Phòng chiếu</TableHead>
                    <TableHead>Loại ghế</TableHead>
                    <TableHead>Hệ số giá</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {seats.map((seat) => (
                    <TableRow
                      key={seat.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell className="font-medium">
                        {seat.row}
                        {seat.column}
                      </TableCell>

                      <TableCell>{seat.room?.name || "N/A"}</TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            seatTypeConfig[seat.type as SeatType]?.variant ||
                            "secondary"
                          }
                        >
                          {seatTypeConfig[seat.type as SeatType]?.label ||
                            seat.type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono">
                          {seat.price_multiplier}x
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(seat)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteSeatId(seat.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4">
                  <BasePagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={onCreateOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo ghế ngồi mới</DialogTitle>
          </DialogHeader>
          <SeatForm
            onSubmit={handleCreateSubmit}
            isLoading={isCreating}
            rooms={rooms}
          />
        </DialogContent>
      </Dialog>

      {/* Bulk Create Dialog */}
      <Dialog open={isBulkCreateOpen} onOpenChange={onBulkCreateOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo ghế hàng loạt</DialogTitle>
          </DialogHeader>
          <BulkSeatForm
            onSubmit={handleBulkCreateSubmit}
            isLoading={isBulkCreating}
            rooms={rooms}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cập nhật ghế ngồi</DialogTitle>
          </DialogHeader>
          <SeatForm
            onSubmit={handleUpdateSubmit}
            initialData={
              selectedSeat
                ? {
                    room_id: selectedSeat.room.id,
                    row: selectedSeat.row,
                    column: selectedSeat.column,
                    type: selectedSeat.type as SeatType,
                    price_multiplier: selectedSeat.price_multiplier,
                  }
                : undefined
            }
            isLoading={isUpdating}
            rooms={rooms}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deleteSeatId}
        onOpenChange={(open) => !open && setDeleteSeatId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ghế ngồi này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
