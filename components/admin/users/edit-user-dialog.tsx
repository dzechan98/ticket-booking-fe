"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateUserSchema,
  type UpdateUserInput,
} from "@/lib/validations/admin-user";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn, getError } from "@/lib/utils";
import { toast } from "sonner";

import { useUpdateProfile } from "@/api/users/update";
import { Gender, UserResponse } from "@/api/users/type";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: UserResponse | null;
}

export function EditUserDialog({ open, onOpenChange, user }: Props) {
  const updateUser = useUpdateProfile(user?.id ?? "");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      full_name: "",
      email: "",
      dob: undefined,
      gender: Gender.OTHER,
      is_admin: false,
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      full_name: user.full_name ?? "",
      email: user.email,
      dob: user.dob ?? undefined,
      gender: user.gender ?? Gender.OTHER,
      is_admin: user.is_admin,
    });
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateUser.mutateAsync({
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString() : undefined,
      });

      toast.success("Cập nhật người dùng thành công");
      onOpenChange(false);
    } catch (error) {
      toast.error(getError(error) || "Cập nhật người dùng thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Họ và tên *</Label>
            <Input {...register("full_name")} />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register("email")} disabled />
          </div>

          <div className="space-y-2">
            <Label>Giới tính *</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Nam</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                    <SelectItem value={Gender.OTHER}>Khác</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.gender && (
              <p className="text-sm text-destructive">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ngày sinh</Label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => {
                const dateValue = field.value
                  ? new Date(field.value)
                  : undefined;

                return (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateValue && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateValue
                            ? format(dateValue, "dd/MM/yyyy")
                            : "Chọn ngày sinh"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateValue}
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : undefined,
                            )
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>

                    {errors.dob && (
                      <p className="text-sm text-destructive">
                        {errors.dob.message}
                      </p>
                    )}
                  </>
                );
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="is_admin"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Quyền Admin</Label>
          </div>

          <Button
            type="submit"
            disabled={updateUser.isPending}
            className="w-full"
          >
            {updateUser.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
