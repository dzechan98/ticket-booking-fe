"use client";

import { useDeleteMovie } from "@/api/movies/delete";
import { useListMovies } from "@/api/movies/list";
import { useListGenres } from "@/api/genres/list";
import { MoviesList } from "@/components/admin/movies/movie-list";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminMoviesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useListMovies({
    page,
    limit: 8,
    title: debouncedSearch || undefined,
    genreId: genreFilter === "all" ? undefined : genreFilter,
  });

  const { data: genresData } = useListGenres({ limit: 100 });
  const genres = genresData?.items ?? [];

  const { mutateAsync: deleteMovie } = useDeleteMovie();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, genreFilter]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      toast.success("Xóa phim thành công!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa phim");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/movies/edit/${id}`);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý phim
          </h1>
          <p className="text-muted-foreground">
            Quản lý danh sách phim chiếu tại rạp
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/movies/create")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Thêm phim mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm theo tên phim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-50">
            <SelectValue placeholder="Lọc theo thể loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thể loại</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Movies List */}
      <MoviesList
        movies={data?.items ?? []}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
