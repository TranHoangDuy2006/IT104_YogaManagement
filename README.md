
# Yoga Management Project

## Tiến độ dự án (25/10/2025)

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
- Trang quản lý lịch tập (SchedulesManagementPage): thống kê, biểu đồ, lọc, phân trang, modal sửa/xoá booking
- Import type Booking từ file type, chuẩn hóa type toàn dự án

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
   - Quản lý lịch tập: <http://localhost:5174/admin/schedules-management>
   - Quản lý dịch vụ: <http://localhost:5174/admin/services-management>
   - API: <http://localhost:1904/users>

---
Mọi vấn đề/báo lỗi vui lòng liên hệ Trần Hoàng Duy - N24DTCN021 (Admin Page).

## Cập nhật hôm nay (25/10/2025)

- Bảo mật / JWT
  - Thay đổi cách lưu thông tin user trên frontend: mã hoá payload user thành JWT trước khi lưu vào `localStorage` trong `src/slices/userSlice.ts`.
  - Thay `jwt-simple` (node-only) bằng `jwt-encode` cho việc mã hoá trên frontend (đã cài đặt). Sử dụng `jwt-decode` để giải mã khi cần hiển thị thông tin user.
  - Cập nhật các file đọc `localStorage.currentUser` để giải mã JWT thay vì dùng `JSON.parse`:
    - `src/components/commons/Navbar.tsx`
    - `src/ProtectedRoute.tsx`
    - `src/pages/BookingPage.tsx`
    - `src/pages/UsersManagementPage.tsx`
    - `src/pages/AdminPage.tsx`
  - Lưu ý bảo mật: việc đặt secret trên frontend là không an toàn cho môi trường production. Thực tế nên tạo và ký JWT ở backend, frontend chỉ lưu token và gửi kèm Authorization header.

- UI / UX & sửa nhỏ
  - Navbar
    - Thêm icon FontAwesome cho menu responsive.
    - Nút hamburger/close đổi sang icon FontAwesome (`fa-bars`, `fa-xmark`).
    - Nếu user có role `admin`, tên hiển thị (`{userName}`) đổi sang màu đỏ và icon user đổi thành `fa-user-secret`.
  - Modal chỉnh sửa người dùng (`src/components/modals/EditUserModal.tsx`)
    - Loại bỏ viền đen mặc định khi focus; chỉ hiển thị viền xanh (focus:ring-2 focus:ring-blue-500) cho các input/select.

- Kiểm tra & kiểu TypeScript
  - Thêm kiểu trả về khi giải mã JWT (`jwtDecode<T>`), sửa một vài lỗi TypeScript liên quan tới payload JWT.
  - Nếu TypeScript báo thiếu declaration cho `jwt-encode`, thêm file `declarations.d.ts` với `declare module 'jwt-encode';`.

### Lệnh cần chạy sau cập nhật

1. Cài thêm gói (nếu chưa có):

```powershell
npm install jwt-encode jwt-decode
```

1. (Tùy chọn) Thêm khai báo TypeScript nếu cần:

```ts
// declarations.d.ts
declare module 'jwt-encode';
```

### Ghi chú

- Những thay đổi này nhằm mục đích demo cách mã hoá token trên frontend và đồng bộ hoá logic giải mã ở các component. Để bảo mật thực sự, hãy xử lý tạo và xác thực JWT trên backend.
