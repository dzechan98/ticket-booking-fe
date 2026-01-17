import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockShowtimes = [
  {
    id: "1",
    date: "01/02/2026",
    time: "09:00 AM",
    room: "Rạp 1",
    availableSeats: 45,
  },
  {
    id: "2",
    date: "01/02/2026",
    time: "12:00 PM",
    room: "Rạp 2",
    availableSeats: 12,
  },
  {
    id: "3",
    date: "01/02/2026",
    time: "03:00 PM",
    room: "Rạp 1",
    availableSeats: 0,
  },
  {
    id: "4",
    date: "01/02/2026",
    time: "06:00 PM",
    room: "Rạp 3",
    availableSeats: 28,
  },
];

export default function AdminShowtimesPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý suất chiếu
          </h1>
          <p className="text-muted-foreground">
            Quản lý lịch chiếu và khả năng sắp xếp của các rạp
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Thêm suất chiếu
        </Button>
      </div>

      {/* Showtimes Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Danh sách suất chiếu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Ngày
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Giờ chiếu
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Rạp
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Ghế trống
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockShowtimes.map((showtime) => (
                  <tr
                    key={showtime.id}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {showtime.date}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {showtime.time}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {showtime.room}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          showtime.availableSeats > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {showtime.availableSeats}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground hover:bg-secondary bg-transparent"
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
