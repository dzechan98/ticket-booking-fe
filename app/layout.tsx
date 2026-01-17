import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryClientProvider } from "@/providers/react-query-client-provider";
import { StoreProvider } from "@/zustand/store";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vz Cinema - Đặt Vé Xem Phim Online",
  description:
    "Đặt vé xem phim trực tuyến dễ dàng tại Vz Cinema. Chọn phim, suất chiếu, ghế và thanh toán nhanh chóng.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ReactQueryClientProvider>
          <StoreProvider>
            <SidebarProvider>
              <Toaster />
              {children}
            </SidebarProvider>
          </StoreProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
