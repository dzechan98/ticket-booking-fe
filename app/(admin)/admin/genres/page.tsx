"use client";

import { useCreateGenre } from "@/api/genres/create";
import { useDeleteGenre } from "@/api/genres/delete";
import { useListGenres } from "@/api/genres/list";
import { useUpdateGenre } from "@/api/genres/update";
import { GenresList } from "@/components/admin/genres/genre-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { CreateGenreInput } from "@/lib/validations/genre";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminGenresPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useListGenres({
    page,
    limit: 8,
    name: debouncedSearch || undefined,
  });

  const { mutateAsync: createGenre } = useCreateGenre();
  const { mutateAsync: updateGenre } = useUpdateGenre();
  const { mutateAsync: deleteGenre } = useDeleteGenre();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleCreate = async (data: CreateGenreInput) => {
    try {
      await createGenre(data);
      toast.success("Tạo thể loại thành công!");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tạo thể loại");
    }
  };

  const handleUpdate = async (id: string, data: CreateGenreInput) => {
    try {
      await updateGenre({ id, data });
      toast.success("Cập nhật thể loại thành công!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể cập nhật thể loại",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGenre(id);
      toast.success("Xóa thể loại thành công!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa thể loại");
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý thể loại
          </h1>
          <p className="text-muted-foreground">Quản lý các thể loại phim</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Thêm thể loại mới
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm theo tên thể loại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Genres List */}
      <GenresList
        genres={data?.items ?? []}
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
