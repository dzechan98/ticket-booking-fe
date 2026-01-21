import Link from "next/link";
import {
  Film,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <Film
                  className="h-8 w-8 text-primary relative"
                  strokeWidth={2}
                />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                CineHub
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng đặt vé xem phim trực tuyến hàng đầu Việt Nam.
            </p>
            <div className="flex gap-3">
              <SocialLink href="#" icon={Facebook} label="Facebook" />
              <SocialLink href="#" icon={Instagram} label="Instagram" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Youtube} label="Youtube" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base text-foreground mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/">Trang chủ</FooterLink>
              <FooterLink href="/movies">Danh sách phim</FooterLink>
              <FooterLink href="/schedule">Lịch chiếu</FooterLink>
              <FooterLink href="/bookings">Lịch sử đặt vé</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-base text-foreground mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              <FooterLink href="#">Chính sách thanh toán</FooterLink>
              <FooterLink href="#">Điều khoản sử dụng</FooterLink>
              <FooterLink href="#">Chính sách bảo mật</FooterLink>
              <FooterLink href="#">Câu hỏi thường gặp</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base text-foreground mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>info@cinehub.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>1900 XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; 2026 CineHub. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Điều khoản
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Quyền riêng tư
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
      >
        <span className="group-hover:translate-x-1 transition-transform">
          {children}
        </span>
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="h-9 w-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary hover:scale-110 transition-all"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
