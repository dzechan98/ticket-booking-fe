"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSeatSchema,
  seatTypeLabels,
  type CreateSeatInput,
} from "@/lib/validations/seat";
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
import { SeatType } from "@/api/seats/type";

interface SeatFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: Partial<CreateSeatInput>;
  isLoading?: boolean;
  rooms?: Array<{ id: string; name: string }>;
}

export function SeatForm({
  onSubmit,
  initialData,
  isLoading = false,
  rooms = [],
}: SeatFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateSeatInput>({
    resolver: zodResolver(createSeatSchema),
    defaultValues: {
      room_id: "",
      row: "",
      column: 1,
      type: SeatType.NORMAL,
      price_multiplier: 1,
    },
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      console.log(1);
      reset({
        room_id: initialData.room_id || "",
        row: initialData.row || "",
        column: initialData.column || 1,
        type: initialData.type || SeatType.NORMAL,
        price_multiplier: initialData.price_multiplier || 1,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CreateSeatInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(
        initialData?.room_id
          ? "Cập nhật ghế ngồi thành công!"
          : "Tạo ghế ngồi thành công!",
      );
      if (!initialData?.room_id) {
        reset();
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          (initialData?.room_id
            ? "Không thể cập nhật ghế ngồi"
            : "Không thể tạo ghế ngồi"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(initialData);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="room_id" className="text-foreground">
          Phòng chiếu <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="room_id"
          control={control}
          render={({ field }) => (
            <Select
              key={field.value}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full border-border text-foreground">
                <SelectValue placeholder="Chọn phòng chiếu" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.room_id && (
          <p className="text-sm text-destructive">{errors.room_id.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="row" className="text-foreground">
            Hàng ghế <span className="text-destructive">*</span>
          </Label>
          <Input
            id="row"
            type="text"
            placeholder="A, B, C..."
            className="border-border text-foreground placeholder:text-muted-foreground uppercase"
            {...register("row")}
          />
          {errors.row && (
            <p className="text-sm text-destructive">{errors.row.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="column" className="text-foreground">
            Số ghế <span className="text-destructive">*</span>
          </Label>
          <Input
            id="column"
            type="number"
            placeholder="1, 2, 3..."
            className="border-border text-foreground placeholder:text-muted-foreground"
            {...register("column", { valueAsNumber: true })}
          />
          {errors.column && (
            <p className="text-sm text-destructive">{errors.column.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-foreground">
          Loại ghế
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full border-border text-foreground">
                <SelectValue placeholder="Chọn loại ghế" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(seatTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_multiplier" className="text-foreground">
          Hệ số giá
        </Label>
        <Input
          id="price_multiplier"
          type="number"
          step="0.1"
          placeholder="1.0"
          className="border-border text-foreground placeholder:text-muted-foreground"
          {...register("price_multiplier", { valueAsNumber: true })}
        />
        {errors.price_multiplier && (
          <p className="text-sm text-destructive">
            {errors.price_multiplier.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="min-w-[100px]"
        >
          {isSubmitting
            ? "Đang xử lý..."
            : initialData?.room_id
              ? "Cập nhật"
              : "Tạo mới"}
        </Button>
      </div>
    </form>
  );
}
