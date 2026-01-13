"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Film, Users, Ticket, Clock, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Quản lý phim", href: "/admin/movies", icon: Film },
  { label: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { label: "Quản lý vé", href: "/admin/tickets", icon: Ticket },
  { label: "Quản lý suất chiếu", href: "/admin/showtimes", icon: Clock },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-full md:w-64 bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">🎬 Admin</h1>
        <p className="text-sm text-muted-foreground">Quản lý rạp chiếu phim</p>
      </div>

      <nav className="p-4 space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition font-medium"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
