import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const mockTickets = [
  {
    id: "1",
    movieTitle: "Phim Hành động Blockbuster",
    showtime: "01/02/2026 - 12:00 PM",
    seats: "A5, A6",
    status: "paid",
    price: 300000,
  },
  {
    id: "2",
    movieTitle: "Phim Tình cảm Lãng mạn",
    showtime: "28/01/2026 - 06:00 PM",
    seats: "B3, B4, B5",
    status: "paid",
    price: 450000,
  },
  {
    id: "3",
    movieTitle: "Phim Kinh dị Rợn người",
    showtime: "20/01/2026 - 09:00 PM",
    seats: "C2",
    status: "cancelled",
    price: 150000,
  },
]

export default function AdminTicketsPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý vé</h1>
            <p className="text-muted-foreground">Theo dõi các vé đã bán và trạng thái thanh toán</p>
          </div>

          {/* Tickets Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Danh sách vé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Phim</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Suất chiếu</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Ghế</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-border hover:bg-secondary transition">
                        <td className="py-3 px-4 font-semibold text-foreground">{ticket.movieTitle}</td>
                        <td className="py-3 px-4 text-muted-foreground">{ticket.showtime}</td>
                        <td className="py-3 px-4 text-muted-foreground">{ticket.seats}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={ticket.status === "paid" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                          >
                            {ticket.status === "paid" ? "Đã thanh toán" : "Đã hủy"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-primary font-semibold">{ticket.price.toLocaleString()} đ</td>
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
