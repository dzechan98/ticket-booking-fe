"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMovieSchema,
  type CreateMovieInput,
} from "@/lib/validations/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useListGenres } from "@/api/genres/list";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/api/upload-image.";
import Image from "next/image";

interface MovieFormProps {
  onSubmit: (data: CreateMovieInput) => Promise<void>;
  initialData?: CreateMovieInput;
  isLoading?: boolean;
}

export function MovieForm({
  onSubmit,
  initialData,
  isLoading = false,
}: MovieFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialData?.release_date ? new Date(initialData.release_date) : undefined,
  );
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(
    initialData?.poster_url || null,
  );
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);

  const { data: genresData } = useListGenres({ limit: 100 });
  const genres = genresData?.items ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<CreateMovieInput>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      duration_minutes: 90,
      release_date: "",
      poster_url: "",
      trailer_url: "",
      genreIds: [],
    },
  });

  const selectedGenreIds = watch("genreIds") || [];

  const handlePosterChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (data: CreateMovieInput) => {
    setIsSubmitting(true);
    try {
      let posterUrl = data.poster_url || "";

      // Upload poster if new file selected
      if (posterFile) {
        setIsUploadingPoster(true);
        try {
          posterUrl = await uploadImage(posterFile);
        } catch (error) {
          toast.error("Upload poster thất bại");
          throw error;
        } finally {
          setIsUploadingPoster(false);
        }
      }

      await onSubmit({
        ...data,
        poster_url: posterUrl,
      });

      if (!initialData) {
        reset();
        setDate(undefined);
        setPosterFile(null);
        setPosterPreview(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenreToggle = (genreId: string) => {
    const currentIds = selectedGenreIds;
    const newIds = currentIds.includes(genreId)
      ? currentIds.filter((id) => id !== genreId)
      : [...currentIds, genreId];
    setValue("genreIds", newIds);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title" className="text-foreground">
            Tên phim <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Nhập tên phim..."
            className="border-border text-foreground placeholder:text-muted-foreground"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration_minutes" className="text-foreground">
            Thời lượng (phút) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="duration_minutes"
            type="number"
            placeholder="90"
            className="border-border text-foreground placeholder:text-muted-foreground"
            {...register("duration_minutes", { valueAsNumber: true })}
          />
          {errors.duration_minutes && (
            <p className="text-sm text-destructive">
              {errors.duration_minutes.message}
            </p>
          )}
        </div>

        {/* Release Date */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-foreground">Ngày phát hành</Label>
          <Controller
            name="release_date"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      field.onChange(
                        newDate ? format(newDate, "yyyy-MM-dd") : "",
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.release_date && (
            <p className="text-sm text-destructive">
              {errors.release_date.message}
            </p>
          )}
        </div>

        {/* Poster Upload */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="poster" className="text-foreground">
            Poster phim
          </Label>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Preview */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
                {posterPreview ? (
                  <Image
                    src={posterPreview}
                    alt="Poster preview"
                    width={192}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Chưa có poster
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Input */}
            <div className="flex-1 space-y-2">
              <Input
                id="poster"
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="cursor-pointer"
                disabled={isUploadingPoster}
              />
              <p className="text-xs text-muted-foreground">
                Định dạng: JPG, PNG, WebP. Kích thước tối đa: 5MB
              </p>
              {isUploadingPoster && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang upload poster...
                </div>
              )}
            </div>
          </div>
          {errors.poster_url && (
            <p className="text-sm text-destructive">
              {errors.poster_url.message}
            </p>
          )}
        </div>

        {/* Trailer URL */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="trailer_url" className="text-foreground">
            URL Trailer (YouTube, Vimeo, etc.)
          </Label>
          <Input
            id="trailer_url"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            className="border-border text-foreground placeholder:text-muted-foreground"
            {...register("trailer_url")}
          />
          {errors.trailer_url && (
            <p className="text-sm text-destructive">
              {errors.trailer_url.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className="text-foreground">
            Mô tả
          </Label>
          <Textarea
            id="description"
            placeholder="Mô tả về bộ phim..."
            rows={4}
            className="border-border text-foreground placeholder:text-muted-foreground resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Genres */}
        <div className="space-y-2 md:col-span-2">
          <Label className="text-foreground">Thể loại</Label>
          <div className="border border-border rounded-md p-4">
            {genres.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                Chưa có thể loại nào. Vui lòng tạo thể loại trước.
              </p>
            ) : (
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre.id}`}
                        checked={selectedGenreIds.includes(genre.id)}
                        onCheckedChange={() => handleGenreToggle(genre.id)}
                      />
                      <label
                        htmlFor={`genre-${genre.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {genre.name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          {errors.genreIds && (
            <p className="text-sm text-destructive">
              {errors.genreIds.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="min-w-[120px]"
        >
          {isSubmitting || isLoading
            ? "Đang xử lý..."
            : initialData
              ? "Cập nhật"
              : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}
