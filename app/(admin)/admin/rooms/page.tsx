"use client";

import { useCreateRoom } from "@/api/rooms/create";
import { useDeleteRoom } from "@/api/rooms/delete";
import { useListRooms } from "@/api/rooms/list";
import { useUpdateRoom } from "@/api/rooms/update";
import { RoomsList } from "@/components/admin/rooms/room-list";
import { Button } from "@/components/ui/button";
import { CreateRoomInput } from "@/lib/validations/room";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminRoomsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListRooms(page, 8);

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
        error?.response?.data?.message || "Không thể tạo phòng chiếu",
      );
    }
  };

  const handleUpdate = async (id: string, data: CreateRoomInput) => {
    try {
      await updateRoom({ id, data });
      toast.success("Cập nhật phòng chiếu thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể cập nhật phòng chiếu",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRoom(id);
      toast.success("Xóa phòng chiếu thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể xóa phòng chiếu",
      );
    }
  };

  return (
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
        rooms={data?.items ?? []}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isCreateOpen={isCreateDialogOpen}
        onCreateOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
