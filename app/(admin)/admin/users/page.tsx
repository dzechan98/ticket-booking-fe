"use client";

import { useState } from "react";
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
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { data, isLoading } = useListUsers(1, 8);
  const deleteUser = useDeleteUser();

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý người dùng</h1>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngày sinh</TableHead>
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
                    {user.gender === Gender.MALE && "Nam"}
                    {user.gender === Gender.FEMALE && "Nữ"}
                    {user.gender === Gender.OTHER && "Khác"}
                  </TableCell>

                  <TableCell>
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString("vi-VN")
                      : "—"}
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
        </CardContent>
      </Card>

      <EditUserDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        user={selectedUser}
      />

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
