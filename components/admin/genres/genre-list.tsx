"use client";

import type { GenreResponse } from "@/api/genres/type";
import { BasePagination } from "@/components/common/base-pagination";
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
import type { CreateGenreInput } from "@/lib/validations/genre";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { GenreForm } from "./genre-form";

interface GenresListProps {
  genres: GenreResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  isCreateOpen: boolean;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: (data: CreateGenreInput) => Promise<void>;
  onUpdate: (id: string, data: CreateGenreInput) => Promise<void>;
  onCreateOpenChange: (open: boolean) => void;
}

export function GenresList({
  page,
  totalPages,
  genres,
  isLoading,
  isCreateOpen,
  onDelete,
  onCreate,
  onUpdate,
  onPageChange,
  onCreateOpenChange,
}: GenresListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponse | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteGenreId, setDeleteGenreId] = useState<string | null>(null);

  const handleEdit = (genre: GenreResponse) => {
    setSelectedGenre(genre);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = async (data: CreateGenreInput) => {
    setIsCreating(true);
    try {
      await onCreate(data);
      onCreateOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubmit = async (data: CreateGenreInput) => {
    if (!selectedGenre) return;

    setIsUpdating(true);
    try {
      await onUpdate(selectedGenre.id, data);
      setIsEditOpen(false);
      setSelectedGenre(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Danh sách thể loại</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : genres.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Chưa có thể loại nào
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên thể loại</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {genres.map((genre) => (
                    <TableRow
                      key={genre.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell className="font-medium">
                        {genre.name}
                      </TableCell>

                      <TableCell className="text-muted-foreground max-w-md">
                        {genre.description || (
                          <span className="italic text-muted-foreground/60">
                            Không có mô tả
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(genre)}
                          >
                            <Edit2 className="mr-1 h-4 w-4" />
                            Sửa
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive"
                            onClick={() => setDeleteGenreId(genre.id)}
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
            <DialogTitle>Tạo thể loại mới</DialogTitle>
          </DialogHeader>
          <GenreForm onSubmit={handleCreateSubmit} isLoading={isCreating} />
        </DialogContent>
      </Dialog>

      {/* Update dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật thể loại</DialogTitle>
          </DialogHeader>

          {selectedGenre && (
            <GenreForm
              initialData={{
                name: selectedGenre.name,
                description: selectedGenre.description || "",
              }}
              onSubmit={handleUpdateSubmit}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteGenreId}
        onOpenChange={() => setDeleteGenreId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá thể loại</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xoá thể loại này không?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteGenreId(null)}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteGenreId) return;
                await onDelete(deleteGenreId);
                setDeleteGenreId(null);
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
