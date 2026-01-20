"use client";

import { useCreateSeat, useCreateMultipleSeats } from "@/api/seats/create";
import { useDeleteSeat } from "@/api/seats/delete";
import { useListSeats } from "@/api/seats/list";
import { useUpdateSeat } from "@/api/seats/update";
import { useListRooms } from "@/api/rooms/list";
import { SeatsList } from "@/components/admin/seats/seat-list";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateSeatInput,
  UpdateSeatInput,
  CreateMultipleSeatsInput,
  seatTypeLabels,
} from "@/lib/validations/seat";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminSeatsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: roomsData } = useListRooms({ limit: 100 });
  const rooms =
    roomsData?.items.map((room) => ({
      id: room.id,
      name: room.name,
    })) || [];

  const { data, isLoading } = useListSeats({
    page,
    limit: 10,
    room_id: roomFilter === "all" ? undefined : roomFilter,
    type: typeFilter === "all" ? undefined : typeFilter,
  });

  const { mutateAsync: createSeat } = useCreateSeat();
  const { mutateAsync: createMultipleSeats } = useCreateMultipleSeats();
  const { mutateAsync: updateSeat } = useUpdateSeat();
  const { mutateAsync: deleteSeat } = useDeleteSeat();

  useEffect(() => {
    setPage(1);
  }, [roomFilter, typeFilter]);

  const handleCreate = async (data: CreateSeatInput) => {
    try {
      await createSeat(data);
      toast.success("Tạo ghế ngồi thành công!");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tạo ghế ngồi");
      throw error;
    }
  };

  const handleBulkCreate = async (data: CreateMultipleSeatsInput) => {
    try {
      await createMultipleSeats(data);
      toast.success("Tạo ghế hàng loạt thành công!");
      setIsBulkCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Không thể tạo ghế hàng loạt");
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: UpdateSeatInput) => {
    try {
      await updateSeat({ id, data });
      toast.success("Cập nhật ghế ngồi thành công!");
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật ghế ngồi");
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSeat(id);
      toast.success("Xóa ghế ngồi thành công!");
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa ghế ngồi");
      throw error;
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý ghế ngồi
          </h1>
          <p className="text-muted-foreground">
            Quản lý ghế ngồi trong các phòng chiếu
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Thêm ghế đơn
          </Button>
          <Button
            onClick={() => setIsBulkCreateDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Tạo hàng loạt
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Lọc theo phòng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phòng</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Lọc theo loại ghế" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {Object.entries(seatTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <SeatsList
        seats={data?.items || []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages || 1}
        isCreateOpen={isCreateDialogOpen}
        isBulkCreateOpen={isBulkCreateDialogOpen}
        rooms={rooms}
        onPageChange={setPage}
        onCreate={handleCreate}
        onBulkCreate={handleBulkCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onCreateOpenChange={setIsCreateDialogOpen}
        onBulkCreateOpenChange={setIsBulkCreateDialogOpen}
      />
    </div>
  );
}
