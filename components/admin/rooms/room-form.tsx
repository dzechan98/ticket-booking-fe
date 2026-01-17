"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRoomSchema,
  screenTypeLabels,
  ScreenType,
  type CreateRoomInput,
} from "@/lib/validations/room";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFormProps {
  onSubmit: (data: CreateRoomInput) => Promise<void>;
  initialData?: CreateRoomInput;
  isLoading?: boolean;
}

export function RoomForm({
  onSubmit,
  initialData,
  isLoading = false,
}: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: initialData || {
      name: "",
      screen_type: ScreenType.STANDARD,
      total_seats: 100,
    },
  });

  const handleFormSubmit = async (data: CreateRoomInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        initialData
          ? "Cập nhật phòng chiếu thành công!"
          : "Tạo phòng chiếu thành công!",
      );
      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (initialData
            ? "Không thể cập nhật phòng chiếu"
            : "Không thể tạo phòng chiếu"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Tên phòng <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Phòng 1, Phòng VIP..."
          className=" border-border text-foreground placeholder:text-muted-foreground"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="screen_type" className="text-foreground">
          Loại màn hình <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="screen_type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full border-border text-foreground">
                <SelectValue placeholder="Chọn loại màn hình" />
              </SelectTrigger>

              <SelectContent>
                {Object.entries(screenTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.screen_type && (
          <p className="text-sm text-destructive">
            {errors.screen_type.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_seats" className="text-foreground">
          Tổng số ghế <span className="text-destructive">*</span>
        </Label>
        <Input
          id="total_seats"
          type="number"
          placeholder="100"
          className="border-border text-foreground placeholder:text-muted-foreground"
          {...register("total_seats", { valueAsNumber: true })}
        />
        {errors.total_seats && (
          <p className="text-sm text-destructive">
            {errors.total_seats.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        {isSubmitting || isLoading
          ? "Đang xử lý..."
          : initialData
            ? "Cập nhật"
            : "Tạo phòng"}
      </Button>
    </form>
  );
}
