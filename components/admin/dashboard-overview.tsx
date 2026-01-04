import { StatCard } from "@/components/admin/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng vé bán ra" value="1,234" description="Tháng này" icon="🎫" color="primary" />
        <StatCard title="Doanh thu" value="185.4M" description="+12% so với tháng trước" icon="💰" color="green" />
        <StatCard title="Người dùng" value="892" description="Tài khoản hoạt động" icon="👥" color="blue" />
        <StatCard title="Phim hot" value="8" description="Phim được xem nhiều" icon="⭐" color="accent" />
      </div>

      {/* Popular Movies */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Phim hot nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Phim Hành động 1", views: 324, revenue: "48.6M" },
              { name: "Phim Tình cảm 1", views: 281, revenue: "42.15M" },
              { name: "Phim Kinh dị 1", views: 198, revenue: "29.7M" },
              { name: "Phim Hài hước 1", views: 156, revenue: "23.4M" },
            ].map((movie, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{movie.name}</p>
                  <p className="text-sm text-muted-foreground">{movie.views} lượt xem</p>
                </div>
                <p className="font-bold text-primary">{movie.revenue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Showtimes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Suất chiếu được đặt nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Suất chiếu</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rạp</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Tổng vé bán</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "12:00 PM", room: "Rạp 1", tickets: 45, revenue: "6.75M" },
                  { time: "03:00 PM", room: "Rạp 2", tickets: 38, revenue: "5.7M" },
                  { time: "06:00 PM", room: "Rạp 3", tickets: 52, revenue: "7.8M" },
                  { time: "09:00 PM", room: "Rạp 1", tickets: 29, revenue: "4.35M" },
                ].map((showtime, index) => (
                  <tr key={index} className="border-b border-border hover:bg-secondary transition">
                    <td className="py-3 px-4 text-foreground">{showtime.time}</td>
                    <td className="py-3 px-4 text-muted-foreground">{showtime.room}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{showtime.tickets}</td>
                    <td className="py-3 px-4 text-primary font-semibold">{showtime.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
