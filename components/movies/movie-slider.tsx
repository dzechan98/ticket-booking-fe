"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SliderMovie {
  id: string
  title: string
  posterUrl: string
}

const sliderMovies: SliderMovie[] = [
  {
    id: "1",
    title: "Phim Hot 1",
    posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  },
  {
    id: "2",
    title: "Phim Hot 2",
    posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  },
  {
    id: "3",
    title: "Phim Hot 3",
    posterUrl: "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
  },
]

export function MovieSlider() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % sliderMovies.length)
  const prev = () => setCurrent((prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length)

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [])

  const movie = sliderMovies[current]

  return (
    <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-xl bg-secondary">
      {/* Background Image */}
      <img
        src={movie.posterUrl || "/placeholder.svg"}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{movie.title}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">Phim hay nhất của tuần, không nên bỏ lỡ!</p>
        <Button asChild className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <Link href={`/movies/${movie.id}`}>Đặt vé ngay</Link>
        </Button>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {sliderMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === current ? "bg-primary w-8" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
