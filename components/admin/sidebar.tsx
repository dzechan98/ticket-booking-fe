"use client";

import {
  BarChart3,
  Box,
  Clock,
  Film,
  LogOut,
  Tags,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Quản lý phim", href: "/admin/movies", icon: Film },
  { label: "Quản lý thể loại", href: "/admin/genres", icon: Tags },
  { label: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { label: "Quản lý booking", href: "/admin/bookings", icon: Ticket },
  { label: "Quản lý phòng chiếu", href: "/admin/rooms", icon: Box },
  { label: "Quản lý suất chiếu", href: "/admin/showtimes", icon: Clock },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <div>
          <h1 className="text-xl font-bold text-primary">🎬 Admin</h1>
          <p className="text-xs text-muted-foreground">
            Quản lý rạp chiếu phim
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* Menu */}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="cursor-pointer text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
