
# Yoga Management Project

## Tiến độ dự án (18/10/2025)

### Đã hoàn thành

- Thiết lập project React + TypeScript + Vite
- Cấu hình ESLint, TailwindCSS
- Tạo các component chính: Navbar, Banner, ClassList, Footer
- Trang HomePage hiển thị các component chính, responsive tốt trên desktop/mobile
- Tạo form đăng ký tài khoản với validate bằng Yup + React Hook Form
- Kết nối API đăng ký với json-server (cổng 1904)
- Xử lý chuyển hướng về HomePage sau khi đăng ký thành công
- Setup routing cho HomePage, RegisterForm, LoginForm, BookingPage, AdminPage
- Đã hoàn thiện modal thêm/xoá dịch vụ, hiệu ứng hover đẹp cho nút và modal
- Đã dùng Redux Toolkit (createAsyncThunk) cho đăng nhập, lưu user/role vào Redux + localStorage
- Đã refactor navigation dùng button + useNavigate (delay chuyển trang)
- Đã fix layout sticky footer: Footer luôn nằm dưới, không đè lên ClassList khi responsive

### Đang phát triển

- Quản lý lịch tập, trang BookingPage (đặt lịch, modal đặt lịch)
- Trang quản lý dịch vụ (AdminPage): thêm/sửa/xoá dịch vụ, xác nhận xoá
- Tối ưu UX/UI, hoàn thiện responsive cho mọi màn hình
- Bổ sung unit test cho các slice và component chính

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

4. Truy cập:
   - Trang chủ: <http://localhost:5174/>
   - Đăng ký: <http://localhost:5174/register>
   - Đăng nhập: <http://localhost:5174/login>
   - Đặt lịch: <http://localhost:5174/booking>
   - Quản lý dịch vụ: <http://localhost:5174/admin>
   - API: <http://localhost:1904/users>

---
Mọi vấn đề/báo lỗi vui lòng liên hệ Trần Hoàng Duy (Admin Page).
