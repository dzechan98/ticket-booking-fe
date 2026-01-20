"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMultipleSeatsSchema,
  seatTypeLabels,
  type CreateMultipleSeatsInput,
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { SeatType } from "@/api/seats/type";

interface BulkSeatFormProps {
  onSubmit: (data: CreateMultipleSeatsInput) => Promise<void>;
  isLoading?: boolean;
  rooms?: Array<{ id: string; name: string }>;
}

export function BulkSeatForm({
  onSubmit,
  isLoading = false,
  rooms = [],
}: BulkSeatFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rowInput, setRowInput] = useState("");
  const [rows, setRows] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<CreateMultipleSeatsInput>({
    resolver: zodResolver(createMultipleSeatsSchema),
    defaultValues: {
      room_id: "",
      rows: [],
      columns_per_row: 10,
      seat_type: SeatType.NORMAL,
      price_multiplier: 1,
    },
  });

  const handleAddRow = () => {
    const upperRow = rowInput.toUpperCase().trim();
    if (upperRow && /^[A-Z]+$/.test(upperRow)) {
      if (!rows.includes(upperRow)) {
        const newRows = [...rows, upperRow];
        setRows(newRows);
        setValue("rows", newRows);
        setRowInput("");
      } else {
        toast.error("Hàng ghế này đã tồn tại");
      }
    } else {
      toast.error("Hàng ghế phải là chữ cái in hoa");
    }
  };

  const handleRemoveRow = (rowToRemove: string) => {
    const newRows = rows.filter((r) => r !== rowToRemove);
    setRows(newRows);
    setValue("rows", newRows);
  };

  const handleFormSubmit = async (data: CreateMultipleSeatsInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success("Tạo ghế hàng loạt thành công!");
      reset();
      setRows([]);
      setRowInput("");
    } catch (error: any) {
      toast.error(error?.message || "Không thể tạo ghế hàng loạt");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Select value={field.value} onValueChange={field.onChange}>
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

      <div className="space-y-2">
        <Label htmlFor="rowInput" className="text-foreground">
          Hàng ghế <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="rowInput"
            type="text"
            placeholder="A, B, C..."
            value={rowInput}
            onChange={(e) => setRowInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRow();
              }
            }}
            className="border-border text-foreground placeholder:text-muted-foreground uppercase"
          />
          <Button type="button" onClick={handleAddRow} variant="secondary">
            Thêm
          </Button>
        </div>
        {errors.rows && (
          <p className="text-sm text-destructive">{errors.rows.message}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {rows.map((row) => (
            <Badge key={row} variant="secondary" className="px-3 py-1">
              {row}
              <button
                type="button"
                onClick={() => handleRemoveRow(row)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="columns_per_row" className="text-foreground">
          Số ghế mỗi hàng <span className="text-destructive">*</span>
        </Label>
        <Input
          id="columns_per_row"
          type="number"
          placeholder="10"
          className="border-border text-foreground placeholder:text-muted-foreground"
          {...register("columns_per_row", { valueAsNumber: true })}
        />
        {errors.columns_per_row && (
          <p className="text-sm text-destructive">
            {errors.columns_per_row.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="seat_type" className="text-foreground">
          Loại ghế
        </Label>
        <Controller
          name="seat_type"
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
        {errors.seat_type && (
          <p className="text-sm text-destructive">{errors.seat_type.message}</p>
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
          disabled={isSubmitting || isLoading || rows.length === 0}
          className="min-w-[100px]"
        >
          {isSubmitting ? "Đang xử lý..." : "Tạo hàng loạt"}
        </Button>
      </div>
    </form>
  );
}
