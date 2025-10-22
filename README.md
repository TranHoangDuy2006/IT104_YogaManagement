# Yoga Management Project

## Tiến độ dự án (22/10/2025)

### Đã hoàn thành

- Thiết lập project React + TypeScript + Vite
- Cấu hình ESLint, TailwindCSS
- Tạo các component chính: Navbar, Banner, ClassList, Footer
- Trang HomePage hiển thị các component chính, responsive tốt trên desktop/mobile
- Tạo form đăng ký tài khoản với validate bằng Yup + React Hook Form
- Kết nối API đăng ký với json-server (cổng 1904)
- Xử lý chuyển hướng về HomePage sau khi đăng ký thành công
- Setup routing cho HomePage, RegisterForm, LoginForm, BookingPage, AdminPage
- Hoàn thiện modal thêm/xoá dịch vụ, hiệu ứng hover đẹp cho nút và modal
- Dùng Redux Toolkit (createAsyncThunk) cho đăng nhập, lưu user/role vào Redux + localStorage
- Refactor navigation dùng button + useNavigate (delay chuyển trang)
- Quản lý CRUD người dùng (AdminPage): thêm, sửa, xoá user (trừ admin hiện tại), xác nhận xoá bằng modal, đồng bộ dữ liệu với db.json
- Modal thêm/sửa user UI đẹp, xác thực dữ liệu cơ bản, cập nhật realtime danh sách
- Modal xác nhận xoá user, tối ưu trải nghiệm người dùng
- Tối ưu UI/UX, responsive cho mọi màn hình, sử dụng FontAwesome cho icon
- Hiển thị lịch tập của từng user dưới dạng bảng đẹp, có cột Ngày, Giờ, Lớp học, Tên, Email
- Tạo createAsyncThunk fetchBookingsByUser, gọi API /bookings?userId={id} cho từng user
- Nút "Lịch" chuyển thành "Mở Lịch"/"Ẩn Lịch" với màu hover tím, UX rõ ràng
- Sửa icon đăng xuất Navbar thành fa-solid fa-right-from-bracket (FontAwesome 6)
- Cải thiện responsive, style cho bảng lịch, tối ưu trải nghiệm admin
- Fix các lỗi nhỏ về type, linter, logic hiển thị

### Đang phát triển

- Quản lý lịch tập, trang BookingPage (đặt lịch, modal đặt lịch, CRUD booking)
- Trang quản lý dịch vụ (AdminPage): thêm/sửa/xoá dịch vụ, xác nhận xoá
- Bổ sung unit test cho các slice và component chính
- Tối ưu hiệu năng, kiểm thử toàn bộ flow

### Hướng dẫn chạy dự án

1. Cài đặt dependencies:

   ```powershell
   npm install
   ```

2. Chạy server giả lập API:

   ```powershell
   npm run server
   ```

3. Chạy ứng dụng React:

   ```powershell
   npm run dev
   ```

4. Chạy toàn bộ ứng dụng (server + client):

   ```powershell
   npm run dev-all
   ```

5. Truy cập:
   - Trang chủ: <http://localhost:5174/>
   - Đăng ký: <http://localhost:5174/register>
   - Đăng nhập: <http://localhost:5174/login>
   - Đặt lịch: <http://localhost:5174/booking>
   - Quản lý người dùng: <http://localhost:5174/admin>
   - API: <http://localhost:1904/users>

---
Mọi vấn đề/báo lỗi vui lòng liên hệ Trần Hoàng Duy - N24DTCN021 (Admin Page).
