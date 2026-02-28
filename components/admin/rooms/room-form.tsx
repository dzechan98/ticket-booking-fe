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

      <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="space-y-1">
          <Label className="text-foreground font-semibold">
            Cấu hình ghế ngồi
          </Label>
          <p className="text-sm text-muted-foreground">
            Phòng chiếu tự động có{" "}
            <span className="font-semibold text-foreground">100 ghế</span> với
            cấu hình:
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground min-w-30">
              Sơ đồ ghế:
            </span>
            <span className="text-muted-foreground">
              A1-A10, B1-B10, C1-C10, D1-D10, E1-E10, F1-F10, G1-G10, H1-H10,
              I1-I10, J1-J10
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground min-w-30">
              Ghế thường:
            </span>
            <span className="text-muted-foreground">
              80 ghế (A1-H10) - Giá cơ bản
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground min-w-30">
              Ghế VIP:
            </span>
            <span className="text-muted-foreground">
              10 ghế (I1-I10) - Hệ số giá{" "}
              <span className="font-semibold text-orange-600">1.5x</span>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground min-w-30">
              Ghế Couple:
            </span>
            <span className="text-muted-foreground">
              10 ghế (J1-J10) - Hệ số giá{" "}
              <span className="font-semibold text-pink-600">2.0x</span>
            </span>
          </div>
        </div>
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
