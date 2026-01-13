"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { useListRooms } from "@/api/rooms/list";
import { useCreateRoom } from "@/api/rooms/create";
import { useUpdateRoom } from "@/api/rooms/update";
import { useDeleteRoom } from "@/api/rooms/delete";
import { useState } from "react";
import { CreateRoomInput } from "@/lib/validations/room";
import { RoomsList } from "@/components/admin/rooms/room-list";
import { toast } from "sonner";

export default function AdminRoomsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: rooms = [], isLoading } = useListRooms();
  const { mutateAsync: createRoom } = useCreateRoom();
  const { mutateAsync: updateRoom } = useUpdateRoom();
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  const handleCreate = async (data: CreateRoomInput) => {
    try {
      await createRoom(data);
      toast.success("Tạo phòng chiếu thành công!");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể tạo phòng chiếu"
      );
    }
  };

  const handleUpdate = async (id: string, data: CreateRoomInput) => {
    try {
      await updateRoom({ id, data });
      toast.success("Cập nhật phòng chiếu thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể cập nhật phòng chiếu"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRoom(id);
      toast.success("Xóa phòng chiếu thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể xóa phòng chiếu"
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Quản lý phòng chiếu
              </h1>
              <p className="text-muted-foreground">
                Quản lý các phòng chiếu tại rạp phim
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Thêm phòng mới
            </Button>
          </div>

          {/* Rooms List */}
          <RoomsList
            rooms={rooms}
            isLoading={isLoading}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isCreateOpen={isCreateDialogOpen}
            onCreateOpenChange={setIsCreateDialogOpen}
          />
        </div>
      </main>
    </div>
  );
}
