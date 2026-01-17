"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuth();
  const avatarFallback =
    user?.full_name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-primary hover:opacity-80 transition"
          >
            <span>🎬</span>
            <span>CineHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition"
            >
              Trang chủ
            </Link>
            <Link
              href="/movies"
              className="text-foreground hover:text-primary transition"
            >
              Phim
            </Link>
            <Link
              href="/schedule"
              className="text-foreground hover:text-primary transition"
            >
              Lịch chiếu
            </Link>
            <Link
              href="/bookings"
              className="text-foreground hover:text-primary transition"
            >
              Lịch sử đặt vé
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage
                      src={user?.avatar || ""}
                      alt={user.full_name || user.email}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      Thông tin cá nhân
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive-foreground cursor-pointer"
                    onClick={logout}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="bg-card border-border text-foreground hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
