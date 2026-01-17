"use client";

import type { RoomResponse } from "@/api/rooms/type";
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
import type { CreateRoomInput } from "@/lib/validations/room";
import { ScreenType } from "@/lib/validations/room";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { RoomForm } from "./room-form";

interface RoomsListProps {
  rooms: RoomResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  isCreateOpen: boolean;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: (data: CreateRoomInput) => Promise<void>;
  onUpdate: (id: string, data: CreateRoomInput) => Promise<void>;
  onCreateOpenChange: (open: boolean) => void;
}

export const screenTypeConfig: Record<
  ScreenType,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  [ScreenType.STANDARD]: {
    label: "Standard",
    variant: "secondary",
  },
  [ScreenType.IMAX]: {
    label: "IMAX",
    variant: "default",
  },
  [ScreenType.SCREEN_X]: {
    label: "ScreenX",
    variant: "outline",
  },
  [ScreenType.GOLD_CLASS]: {
    label: "Gold Class",
    variant: "destructive",
  },
};

export function RoomsList({
  page,
  totalPages,
  rooms,
  isLoading,
  isCreateOpen,
  onDelete,
  onCreate,
  onUpdate,
  onPageChange,
  onCreateOpenChange,
}: RoomsListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  const handleEdit = (room: RoomResponse) => {
    setSelectedRoom(room);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = async (data: CreateRoomInput) => {
    setIsCreating(true);
    try {
      await onCreate(data);
      onCreateOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubmit = async (data: CreateRoomInput) => {
    if (!selectedRoom) return;

    setIsUpdating(true);
    try {
      await onUpdate(selectedRoom.id, data);
      setIsEditOpen(false);
      setSelectedRoom(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Danh sách phòng chiếu</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Chưa có phòng chiếu nào
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên phòng</TableHead>
                    <TableHead>Loại màn hình</TableHead>
                    <TableHead>Tổng số ghế</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rooms.map((room) => (
                    <TableRow
                      key={room.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell className="font-medium">{room.name}</TableCell>

                      <TableCell>
                        <Badge
                          variant={screenTypeConfig[room.screen_type].variant}
                        >
                          {screenTypeConfig[room.screen_type].label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {room.total_seats} ghế
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(room)}
                          >
                            <Edit2 className="mr-1 h-4 w-4" />
                            Sửa
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive"
                            onClick={() => setDeleteRoomId(room.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <BasePagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={onCreateOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo phòng chiếu mới</DialogTitle>
          </DialogHeader>
          <RoomForm onSubmit={handleCreateSubmit} isLoading={isCreating} />
        </DialogContent>
      </Dialog>

      {/* Update dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật phòng chiếu</DialogTitle>
          </DialogHeader>

          {selectedRoom && (
            <RoomForm
              initialData={{
                name: selectedRoom.name,
                screen_type: selectedRoom.screen_type,
                total_seats: selectedRoom.total_seats,
              }}
              onSubmit={handleUpdateSubmit}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteRoomId} onOpenChange={() => setDeleteRoomId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá phòng</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xoá phòng chiếu này không?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteRoomId(null)}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteRoomId) return;
                await onDelete(deleteRoomId);
                setDeleteRoomId(null);
              }}
            >
              Xoá
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
