
# Yoga Management Project

## Chức năng chính đã hoàn thiện

- Đăng ký, đăng nhập, xác thực người dùng bằng JWT
- Quản lý người dùng (admin): thêm, sửa, xoá user
- Quản lý lịch tập: đặt lịch, sửa/xoá lịch, xem lịch của từng user
- Quản lý dịch vụ yoga: thêm, sửa, xoá dịch vụ
- Quản lý khoá học trong từng dịch vụ (hiển thị, lọc, thêm/xoá/sửa khoá học)
- Giao diện responsive, tối ưu cho desktop/mobile
- Hiệu ứng animation cho thông báo, modal, sidebar
- Sử dụng Redux Toolkit, React Router, TailwindCSS, FontAwesome

### Tiến trình ngày 30/10/2025

- Hoàn thiện toàn bộ logic CRUD cho lớp học, dịch vụ, lịch tập, người dùng (createAsyncThunk, REST API).
- Sửa lỗi Redux store, đồng bộ reducer cho courses/services.
- Sửa logic phân trang: auto-correct khi trang hiện tại không có dữ liệu (BookingPage, SchedulesManagementPage).
- Cập nhật UI/UX: màu sắc, hiệu ứng hover, responsive, notification, modal, sidebar.
- Sửa logic input: disable icon mắt khi input rỗng, hiển thị lỗi đúng vị trí từng trường (LoginForm).
- Sửa logic xác thực: thông báo lỗi rõ ràng cho email/mật khẩu, phân loại lỗi hiển thị dưới từng trường.
- Sửa logic admin: ẩn chào mừng và icon khi đăng xuất, sidebar chuyển chức năng mượt mà.
- Fix bug nhỏ: lỗi biên dịch, lỗi khai báo biến, lỗi đồng bộ giá trị input.
- Kiểm tra và xác nhận lại toàn bộ flow đăng nhập, đăng xuất, quản lý, đặt lịch, phân trang, thông báo.

## Hướng dẫn sử dụng

1. Cài dependencies: `npm install`
2. Chạy server API: `npm run server`
3. Chạy app React: `npm run dev`
4. Chạy toàn bộ dự án: `npm run dev-all`
5. Truy cập: <http://localhost:5174/>

## Ghi chú

- Nếu cần hỗ trợ hoặc giải đáp các thắc mắc liên quan đến dự án này, vui lòng liên hệ Trần Hoàng Duy - N24DTCN021
