export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Về CineHub</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng đặt vé xem phim trực tuyến hàng đầu, giúp bạn dễ dàng tìm phim, chọn suất chiếu và ghế yêu thích.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Liên hệ</h3>
            <ul className="text-muted-foreground text-sm space-y-2">
              <li>Email: info@cinehub.vn</li>
              <li>Hotline: 1900 XXXX</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Kết nối</h3>
            <ul className="text-muted-foreground text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 CineHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
