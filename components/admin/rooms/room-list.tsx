"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { screenTypeLabels } from "@/lib/validations/room";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import type { RoomResponse } from "@/api/rooms/type";
import type { CreateRoomInput } from "@/lib/validations/room";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomForm } from "./room-form";

interface RoomsListProps {
  rooms: RoomResponse[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onCreate: (data: CreateRoomInput) => Promise<void>;
  onUpdate: (id: string, data: CreateRoomInput) => Promise<void>;
  isCreateOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

export function RoomsList({
  rooms,
  isLoading,
  onDelete,
  onCreate,
  onUpdate,
  isCreateOpen,
  onCreateOpenChange,
}: RoomsListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (room: RoomResponse) => {
    setSelectedRoom(room);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;

    setIsDeleting(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateSubmit = async (data: CreateRoomInput) => {
    setIsCreating(true);
    try {
      await onCreate(data);
      onCreateOpenChange(false);
    } catch (error) {
      console.error("Create error:", error);
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
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateOpenChange = (open: boolean) => {
    onCreateOpenChange(open);
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Danh sách phòng chiếu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có phòng chiếu nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Tên phòng
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Loại màn hình
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Tổng số ghế
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr
                      key={room.id}
                      className="border-b border-border hover:bg-secondary transition"
                    >
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {room.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {screenTypeLabels[room.screen_type]}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {room.total_seats} ghế
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(room)}
                            className="border-border text-foreground hover:bg-secondary bg-transparent"
                          >
                            <Edit2 size={16} className="mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(room.id)}
                            disabled={isDeleting === room.id}
                            className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                          >
                            {isDeleting === room.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={handleCreateOpenChange}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Tạo phòng chiếu mới
            </DialogTitle>
          </DialogHeader>
          <RoomForm onSubmit={handleCreateSubmit} isLoading={isCreating} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Cập nhật phòng chiếu
            </DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <RoomForm
              onSubmit={handleUpdateSubmit}
              initialData={{
                name: selectedRoom.name,
                screen_type: selectedRoom.screen_type,
                total_seats: selectedRoom.total_seats,
              }}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
