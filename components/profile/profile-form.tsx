"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateProfile } from "@/api/users/update";
import Image from "next/image";
import { uploadImage } from "@/api/upload-image.";
import { useAuth } from "@/hooks/use-auth";
import { Gender } from "@/api/users/type";

export function ProfileForm() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const updateProfile = useUpdateProfile();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      dob: undefined,
      avatar: "",
      gender: Gender.OTHER,
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));

    setValue("avatar", file.name, { shouldValidate: true });
  };

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      if (!avatarFile && !preview) {
        toast.error("Vui lòng chọn ảnh đại diện");
        return;
      }

      let avatarUrl = data.avatar || "";
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      await updateProfile.mutateAsync({
        ...data,
        avatar: avatarUrl,
        dob: new Date(data.dob!).toISOString(),
      });

      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(error?.message || "Cập nhật thất bại");
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name ?? "",
        email: user.email ?? "",
        gender: user.gender as Gender,
        dob: user.dob ?? undefined,
        avatar: user.avatar ?? "",
      });
      setPreview(user.avatar || null);
    }
  }, [user, reset]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar */}
          <div className="space-y-2">
            <Label>Ảnh đại diện *</Label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            {errors.avatar && (
              <p className="text-sm text-destructive">
                {errors.avatar.message}
              </p>
            )}
            {preview && (
              <Image
                src={preview}
                alt="avatar-preview"
                width={96}
                height={96}
                className="rounded-full size-24 border"
              />
            )}
          </div>

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
            <Label>Email *</Label>
            <Input {...register("email")} disabled />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
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
                  <SelectTrigger className="w-full">
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
            <Label>Ngày sinh *</Label>
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

          <Button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full"
          >
            {updateProfile.isPending
              ? "Đang cập nhật..."
              : "Cập nhật thông tin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
