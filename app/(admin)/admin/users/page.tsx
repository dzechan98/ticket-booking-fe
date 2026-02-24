"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { useListUsers } from "@/api/users/list";
import { useDeleteUser } from "@/api/users/delete";
import { UserResponse, Gender } from "@/api/users/type";
import { genderLabels } from "@/lib/utils/enum-labels";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { BasePagination } from "@/components/common/base-pagination";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useListUsers({
    page,
    limit: 8,
    email: debouncedSearch || undefined,
    is_admin: roleFilter === "all" ? undefined : roleFilter === "admin",
  });
  const deleteUser = useDeleteUser();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground">
            Quản lý danh sách người dùng trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Thêm người dùng
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm theo email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>

                <TableCell>{user.full_name ?? "—"}</TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell>
                  {user.gender ? genderLabels[user.gender] : "—"}
                </TableCell>

                <TableCell>
                  {user.dob
                    ? new Date(user.dob).toLocaleDateString("vi-VN")
                    : "—"}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.is_admin
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.is_admin ? "Admin" : "User"}
                  </span>
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenEdit(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setUserToDelete(user);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <BasePagination
          page={page}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>

      <EditUserDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        user={selectedUser}
      />

      <CreateUserDialog open={openCreate} onOpenChange={setOpenCreate} />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{userToDelete?.full_name || userToDelete?.email}</strong>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (userToDelete) {
                  try {
                    await deleteUser.mutateAsync(userToDelete.id);
                    toast.success("Xóa người dùng thành công");
                    setOpenDeleteDialog(false);
                    setUserToDelete(null);
                  } catch (error) {
                    toast.error("Xóa người dùng thất bại");
                  }
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
