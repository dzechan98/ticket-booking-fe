"use client";

import type { MovieResponse } from "@/api/movies/type";
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
import { Edit2, Loader2, Trash2, Star } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MoviesListProps {
  movies: MovieResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
}

export function MoviesList({
  page,
  totalPages,
  movies,
  isLoading,
  onDelete,
  onEdit,
  onPageChange,
}: MoviesListProps) {
  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa có";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch {
      return "Không hợp lệ";
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Danh sách phim</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : movies.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              Chưa có phim nào
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên phim</TableHead>
                    <TableHead>Thể loại</TableHead>
                    <TableHead>Thời lượng</TableHead>
                    <TableHead>Quốc gia</TableHead>
                    <TableHead>Năm SX</TableHead>
                    <TableHead>Ngày phát hành</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {movies.map((movie) => (
                    <TableRow
                      key={movie.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell className="font-medium max-w-[250px]">
                        <div className="truncate">{movie.title}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {movie.genres && movie.genres.length > 0 ? (
                            movie.genres.map((genre) => (
                              <Badge
                                key={genre.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {genre.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm italic">
                              Chưa có thể loại
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {movie.duration_minutes} phút
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {movie.country || "Chưa có"}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {movie.production_year || "Chưa có"}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {formatDate(movie.release_date)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {movie.avgRating
                              ? movie.avgRating.toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(movie.id)}
                          >
                            <Edit2 className="mr-1 h-4 w-4" />
                            Sửa
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive"
                            onClick={() => setDeleteMovieId(movie.id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteMovieId}
        onOpenChange={() => setDeleteMovieId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá phim</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xoá phim này không?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteMovieId(null)}>
              Huỷ
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteMovieId) return;
                await onDelete(deleteMovieId);
                setDeleteMovieId(null);
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
