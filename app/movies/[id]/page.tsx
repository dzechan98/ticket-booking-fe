import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MovieDetails } from "@/components/movies/movie-details"

const movieData = {
  id: "1",
  title: "Phim Hành động Blockbuster",
  genre: "Hành động",
  duration: 120,
  releaseDate: "15/01/2026",
  rating: 8.5,
  description:
    "Một bộ phim hành động kịch tính với những cảnh quay ngoạn mục, lối dẫn chuyện hấp dẫn và những diễn viên tài năng. Câu chuyện xoay quanh một nhân vật chính phải vượt qua những thử thách nguy hiểm để cứu thế giới khỏi thảm họa.",
  posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  actors: [
    {
      name: "Đỗ Anh Tuấn",
      role: "Vai chính",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=actor1",
    },
    {
      name: "Trần Thị Thu",
      role: "Vai nữ chính",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=actor2",
    },
    {
      name: "Lê Minh Hoàng",
      role: "Vai phản diện",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=actor3",
    },
    {
      name: "Nguyễn Thanh Hà",
      role: "Vai hỗ trợ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=actor4",
    },
  ],
}

export default function MovieDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MovieDetails {...movieData} />
        </section>
      </main>

      <Footer />
    </div>
  )
}
