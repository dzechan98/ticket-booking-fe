"use client";

import { useCreateRoom } from "@/api/rooms/create";
import { useDeleteRoom } from "@/api/rooms/delete";
import { useListRooms } from "@/api/rooms/list";
import { useUpdateRoom } from "@/api/rooms/update";
import { ScreenType } from "@/api/rooms/type";
import { RoomsList } from "@/components/admin/rooms/room-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { CreateRoomInput } from "@/lib/validations/room";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminRoomsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [screenTypeFilter, setScreenTypeFilter] = useState<string>("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useListRooms({
    page,
    limit: 8,
    name: debouncedSearch || undefined,
    screen_type: screenTypeFilter === "all" ? undefined : screenTypeFilter,
  });

  const { mutateAsync: createRoom } = useCreateRoom();
  const { mutateAsync: updateRoom } = useUpdateRoom();
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, screenTypeFilter]);

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

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm theo tên phòng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select value={screenTypeFilter} onValueChange={setScreenTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo loại màn hình" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value={ScreenType.STANDARD}>Standard</SelectItem>
            <SelectItem value={ScreenType.IMAX}>IMAX</SelectItem>
            <SelectItem value={ScreenType.SCREEN_X}>ScreenX</SelectItem>
            <SelectItem value={ScreenType.GOLD_CLASS}>Gold Class</SelectItem>
          </SelectContent>
        </Select>
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
