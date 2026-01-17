"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MovieSlider } from "@/components/movies/movie-slider";
import { MovieCard } from "@/components/movies/movie-card";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const currentMovies = [
  {
    id: "1",
    title: "Phim Hành động 1",
    genre: "Hành động",
    duration: 120,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    hasValidShowtime: true,
  },
  {
    id: "2",
    title: "Phim Tình cảm 1",
    genre: "Tình cảm",
    duration: 110,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    hasValidShowtime: true,
  },
  {
    id: "3",
    title: "Phim Kinh dị 1",
    genre: "Kinh dị",
    duration: 100,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    hasValidShowtime: false,
  },
  {
    id: "4",
    title: "Phim Hài hước 1",
    genre: "Hài hước",
    duration: 95,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    hasValidShowtime: true,
  },
  {
    id: "5",
    title: "Phim Phiêu lưu 1",
    genre: "Phiêu lưu",
    duration: 130,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    hasValidShowtime: true,
  },
  {
    id: "6",
    title: "Phim Khoa học viễn tưởng 1",
    genre: "Khoa học viễn tưởng",
    duration: 140,
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    hasValidShowtime: true,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Slider */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MovieSlider />
        </section>

        {/* Currently Showing Movies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Phim đang chiếu
            </h2>
            <p className="text-muted-foreground">
              Tìm và đặt vé cho bộ phim yêu thích của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>

        {/* View All Movies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Link
            href="/movies"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition"
          >
            Xem tất cả phim
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
