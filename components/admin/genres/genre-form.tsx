"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGenreSchema,
  type CreateGenreInput,
} from "@/lib/validations/genre";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface GenreFormProps {
  onSubmit: (data: CreateGenreInput) => Promise<void>;
  initialData?: CreateGenreInput;
  isLoading?: boolean;
}

export function GenreForm({
  onSubmit,
  initialData,
  isLoading = false,
}: GenreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGenreInput>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data: CreateGenreInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        initialData
          ? "Cập nhật thể loại thành công!"
          : "Tạo thể loại thành công!",
      );
      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (initialData
            ? "Không thể cập nhật thể loại"
            : "Không thể tạo thể loại"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Tên thể loại <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Hành động, Kinh dị, Tình cảm..."
          className=" border-border text-foreground placeholder:text-muted-foreground"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Mô tả
        </Label>
        <Textarea
          id="description"
          placeholder="Mô tả về thể loại phim..."
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

      <div className="flex justify-end gap-2">
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
