import { AdminSidebar } from "@/components/admin/sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Xin chào, quản trị viên! Đây là tổng quan hệ thống của bạn.</p>
          </div>

          {/* Content */}
          <DashboardOverview />
        </div>
      </main>
    </div>
  )
}
