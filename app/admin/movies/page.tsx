import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockMovies = [
  {
    id: "1",
    title: "Phim Hành động Blockbuster",
    genre: "Hành động",
    duration: 120,
    releaseDate: "15/01/2026",
  },
  {
    id: "2",
    title: "Phim Tình cảm Lãng mạn",
    genre: "Tình cảm",
    duration: 110,
    releaseDate: "10/01/2026",
  },
  {
    id: "3",
    title: "Phim Kinh dị Rợn người",
    genre: "Kinh dị",
    duration: 100,
    releaseDate: "05/01/2026",
  },
];

export default function AdminMoviesPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Quản lý phim
          </h1>
          <p className="text-muted-foreground">
            Quản lý danh sách phim chiếu tại rạp
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Thêm phim mới
        </Button>
      </div>

      {/* Movies Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Danh sách phim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Tên phim
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Thể loại
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Thời lượng
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Ngày phát hành
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockMovies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="border-b border-border hover:bg-secondary transition"
                  >
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {movie.title}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {movie.genre}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {movie.duration} phút
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {movie.releaseDate}
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
