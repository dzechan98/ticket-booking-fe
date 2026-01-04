import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockUsers = [
  { id: "1", name: "Nguyễn Văn A", email: "user1@example.com", status: "active", joined: "01/01/2026" },
  { id: "2", name: "Trần Thị B", email: "user2@example.com", status: "active", joined: "02/01/2026" },
  { id: "3", name: "Lê Minh C", email: "user3@example.com", status: "inactive", joined: "03/01/2026" },
  { id: "4", name: "Hoàng Đức D", email: "user4@example.com", status: "active", joined: "04/01/2026" },
]

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý người dùng</h1>
            <p className="text-muted-foreground">Quản lý tài khoản người dùng của hệ thống</p>
          </div>

          {/* Users Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Danh sách người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Tên</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Ngày tham gia</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="py-3 px-4 font-semibold text-foreground">{user.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={user.status === "active" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                          >
                            {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{user.joined}</td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-secondary bg-transparent"
                          >
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
