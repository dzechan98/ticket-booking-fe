"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getError } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useUpdateShowtime } from "@/api/showtimes/update";
import { useListMovies } from "@/api/movies/list";
import { useListRooms } from "@/api/rooms/list";
import { Showtime, ShowtimeStatus } from "@/api/showtimes/type";
import { ScreenType } from "@/api/rooms/type";
import {
  showtimeStatusLabels,
  screenTypeLabels,
} from "@/lib/utils/enum-labels";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const PREPARATION_BUFFER_MINUTES = 15;

const createUpdateShowtimeSchema = (minDurationMinutes?: number) =>
  z
    .object({
      movie_id: z.string().optional(),
      room_id: z.string().optional(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      base_price: z.number().min(0, "Giá vé phải lớn hơn 0").optional(),
      status: z
        .enum(["UPCOMING", "ONGOING", "FINISHED", "CANCELLED"])
        .optional(),
    })
    .refine(
      (data) => {
        if (!data.start_time || !data.end_time) return true;
        return new Date(data.start_time) < new Date(data.end_time);
      },
      {
        message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
        path: ["end_time"],
      },
    )
    .refine(
      (data) => {
        if (!data.start_time || !data.end_time || !minDurationMinutes)
          return true;
        const diffMs =
          new Date(data.end_time).getTime() -
          new Date(data.start_time).getTime();
        const diffMinutes = diffMs / 60000;
        return diffMinutes >= minDurationMinutes + PREPARATION_BUFFER_MINUTES;
      },
      {
        message:
          "Thời lượng suất chiếu phải đủ thời lượng phim và thời gian chuẩn bị",
        path: ["end_time"],
      },
    );

type ShowtimeFormData = z.infer<ReturnType<typeof createUpdateShowtimeSchema>>;

interface UpdateShowtimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showtime: Showtime | null;
}

export function UpdateShowtimeDialog({
  open,
  onOpenChange,
  showtime,
}: UpdateShowtimeDialogProps) {
  const { mutate: updateShowtime, isPending } = useUpdateShowtime();
  const { data: moviesData } = useListMovies({ page: 1, limit: 100 });
  const { data: roomsData } = useListRooms({ page: 1, limit: 100 });

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("11:00");

  const [selectedMovieId, setSelectedMovieId] = React.useState<string>("");

  const selectedMovie = React.useMemo(
    () => moviesData?.items.find((m: any) => m.id === selectedMovieId),
    [moviesData, selectedMovieId],
  );

  const minDurationMinutes = selectedMovie?.duration_minutes;
  const requiredMinutes = minDurationMinutes
    ? minDurationMinutes + PREPARATION_BUFFER_MINUTES
    : undefined;

  // Initialize dates when showtime changes
  React.useEffect(() => {
    if (showtime) {
      const start = new Date(showtime.start_time);
      const end = new Date(showtime.end_time);
      setStartDate(start);
      setEndDate(end);
      setStartTime(format(start, "HH:mm"));
      setEndTime(format(end, "HH:mm"));
      setSelectedMovieId(showtime.movie.id);
    }
  }, [showtime]);

  const form = useForm<ShowtimeFormData>({
    resolver: zodResolver(createUpdateShowtimeSchema(minDurationMinutes)),
    values: showtime
      ? {
          movie_id: showtime.movie.id,
          room_id: showtime.room.id,
          start_time: format(
            new Date(showtime.start_time),
            "yyyy-MM-dd'T'HH:mm",
          ),
          end_time: format(new Date(showtime.end_time), "yyyy-MM-dd'T'HH:mm"),
          base_price: showtime.base_price,
          status: showtime.status,
        }
      : undefined,
  });

  // Re-validate end_time khi thay đổi phim
  React.useEffect(() => {
    form.trigger("end_time");
  }, [minDurationMinutes, form]);

  const onSubmit = (data: ShowtimeFormData) => {
    if (!showtime) return;

    const updateData: any = {};

    if (data.movie_id) updateData.movie_id = data.movie_id;
    if (data.room_id) updateData.room_id = data.room_id;
    if (data.start_time) updateData.start_time = data.start_time;
    if (data.end_time) updateData.end_time = data.end_time;
    if (data.base_price !== undefined) updateData.base_price = data.base_price;
    if (data.status) updateData.status = data.status;

    updateShowtime(
      { id: showtime.id, data: updateData },
      {
        onSuccess: () => {
          toast.success("Cập nhật suất chiếu thành công");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(
            getError(error) ?? "Có lỗi xảy ra khi cập nhật suất chiếu",
          );
        },
      },
    );
  };

  if (!showtime) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Cập nhật suất chiếu</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin suất chiếu</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="movie_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phim</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedMovieId(val);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {moviesData?.items.map((movie: any) => (
                        <SelectItem key={movie.id} value={movie.id}>
                          {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {requiredMinutes && (
                    <p className="text-sm text-muted-foreground">
                      Vui lòng chọn thời lượng suất chiếu tối thiểu{" "}
                      <span className="font-medium text-foreground">
                        {requiredMinutes} phút
                      </span>{" "}
                      ({minDurationMinutes} phút phim +{" "}
                      {PREPARATION_BUFFER_MINUTES} phút chuẩn bị)
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phòng chiếu</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomsData?.items.map((room: any) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} -{" "}
                          {screenTypeLabels[room.screen_type as ScreenType]} (
                          {room.total_seats} ghế)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            {startDate ? (
                              format(startDate, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (date) {
                              const [hours, minutes] = startTime.split(":");
                              date.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(date.toISOString());
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      step="60"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        if (startDate) {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(startDate);
                          newDate.setHours(
                            parseInt(hours),
                            parseInt(minutes),
                            0,
                            0,
                          );
                          field.onChange(newDate.toISOString());
                        }
                      }}
                      className="mt-2 bg-background"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Thời gian kết thúc</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            {endDate ? (
                              format(endDate, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            if (date) {
                              const [hours, minutes] = endTime.split(":");
                              date.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(date.toISOString());
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      step="60"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (endDate) {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(endDate);
                          newDate.setHours(
                            parseInt(hours),
                            parseInt(minutes),
                            0,
                            0,
                          );
                          field.onChange(newDate.toISOString());
                        }
                      }}
                      className="mt-2 bg-background"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá vé cơ bản (VNĐ)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ShowtimeStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {showtimeStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
