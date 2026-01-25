"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteShowtime } from "@/api/showtimes/delete";
import { toast } from "sonner";

interface DeleteShowtimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showtimeId: string | null;
  showtimeName: string;
}

export function DeleteShowtimeDialog({
  open,
  onOpenChange,
  showtimeId,
  showtimeName,
}: DeleteShowtimeDialogProps) {
  const { mutate: deleteShowtime, isPending } = useDeleteShowtime();

  const handleDelete = () => {
    if (!showtimeId) return;

    deleteShowtime(showtimeId, {
      onSuccess: () => {
        toast.success("Xóa suất chiếu thành công");
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi xóa suất chiếu",
        );
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa suất chiếu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa suất chiếu <strong>{showtimeName}</strong>
            ? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
