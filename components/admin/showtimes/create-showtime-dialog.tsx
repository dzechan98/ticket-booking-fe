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
import { useCreateShowtime } from "@/api/showtimes/create";
import { useListMovies } from "@/api/movies/list";
import { useListRooms } from "@/api/rooms/list";
import { ScreenType } from "@/api/rooms/type";
import { screenTypeLabels } from "@/lib/utils/enum-labels";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const PREPARATION_BUFFER_MINUTES = 15;

const getCurrentDateTime = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now;
};

const isSameLocalDate = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const createShowtimeSchema = (
  minDurationMinutes?: number,
  minStartDateTime?: Date,
) =>
  z
    .object({
      movie_id: z.string().min(1, "Vui lòng chọn phim"),
      room_id: z.string().min(1, "Vui lòng chọn phòng chiếu"),
      start_time: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
      end_time: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
      base_price: z.number().min(0, "Giá vé phải lớn hơn 0"),
    })
    .refine(
      (data) => {
        if (!data.start_time || !minStartDateTime) return true;
        return new Date(data.start_time) >= minStartDateTime;
      },
      {
        message: "Thời gian bắt đầu phải từ thời điểm hiện tại trở đi",
        path: ["start_time"],
      },
    )
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

type ShowtimeFormData = z.infer<ReturnType<typeof createShowtimeSchema>>;

interface CreateShowtimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShowtimeDialog({
  open,
  onOpenChange,
}: CreateShowtimeDialogProps) {
  const { mutate: createShowtime, isPending } = useCreateShowtime();
  const { data: moviesData } = useListMovies({ page: 1, limit: 100 });
  const { data: roomsData } = useListRooms({ page: 1, limit: 100 });

  const [selectedMovieId, setSelectedMovieId] = React.useState<string>("");

  const selectedMovie = React.useMemo(
    () => moviesData?.items.find((m: any) => m.id === selectedMovieId),
    [moviesData, selectedMovieId],
  );

  const minDurationMinutes = selectedMovie?.duration_minutes;
  const requiredMinutes = minDurationMinutes
    ? minDurationMinutes + PREPARATION_BUFFER_MINUTES
    : undefined;
  const [currentDateTime, setCurrentDateTime] = React.useState<Date>(() =>
    getCurrentDateTime(),
  );

  const form = useForm<ShowtimeFormData>({
    resolver: zodResolver(
      createShowtimeSchema(minDurationMinutes, currentDateTime),
    ),
    defaultValues: {
      movie_id: "",
      room_id: "",
      start_time: "",
      end_time: "",
      base_price: 150000,
    },
  });

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState(() =>
    format(getCurrentDateTime(), "HH:mm"),
  );
  const [endTime, setEndTime] = React.useState(() => {
    const defaultEndTime = new Date(
      getCurrentDateTime().getTime() + 2 * 60 * 60000,
    );
    return format(defaultEndTime, "HH:mm");
  });

  const minStartTime =
    startDate && isSameLocalDate(startDate, currentDateTime)
      ? format(currentDateTime, "HH:mm")
      : undefined;

  // Reset form khi dialog được mở
  React.useEffect(() => {
    if (open) {
      const now = getCurrentDateTime();
      const defaultEndTime = new Date(now.getTime() + 2 * 60 * 60000);

      form.reset();
      setCurrentDateTime(now);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTime(format(now, "HH:mm"));
      setEndTime(format(defaultEndTime, "HH:mm"));
      setSelectedMovieId("");
    }
  }, [open, form]);

  // Re-validate end_time khi thay đổi phim
  React.useEffect(() => {
    form.trigger("end_time");
  }, [minDurationMinutes, form]);

  const onSubmit = (data: ShowtimeFormData) => {
    createShowtime(
      {
        ...data,
        start_time: data.start_time,
        end_time: data.end_time,
      },
      {
        onSuccess: () => {
          toast.success("Tạo suất chiếu thành công");
          form.reset();
          setStartDate(undefined);
          setEndDate(undefined);
          setStartTime("09:00");
          setEndTime("11:00");
          setSelectedMovieId("");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(getError(error) || "Có lỗi xảy ra khi tạo suất chiếu");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Tạo suất chiếu mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo suất chiếu mới
          </DialogDescription>
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
                        <SelectValue placeholder="Chọn phim" />
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
                        <SelectValue placeholder="Chọn phòng chiếu" />
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
                              const nextDate = new Date(date);
                              const nextTime =
                                isSameLocalDate(nextDate, currentDateTime) &&
                                startTime < format(currentDateTime, "HH:mm")
                                  ? format(currentDateTime, "HH:mm")
                                  : startTime;
                              const [hours, minutes] = nextTime.split(":");
                              nextDate.setHours(
                                parseInt(hours),
                                parseInt(minutes),
                                0,
                                0,
                              );
                              setStartTime(nextTime);
                              field.onChange(nextDate.toISOString());
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      step="60"
                      min={minStartTime}
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
                              const nextDate = new Date(date);
                              nextDate.setHours(
                                parseInt(hours),
                                parseInt(minutes),
                                0,
                                0,
                              );
                              field.onChange(nextDate.toISOString());
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
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
                      placeholder="150000"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang tạo..." : "Tạo suất chiếu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
