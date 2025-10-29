
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

## Tiến trình ngày 30/10/2025

- Hoàn thiện CRUD lớp học và dịch vụ sử dụng createAsyncThunk (Redux Toolkit), chuẩn REST API (POST/PATCH/DELETE)
- Fix lỗi Redux: thêm reducer cho courses/services vào store
- Kiểm tra và xác nhận logic BookingPage
- Cập nhật UI NotFoundPage

## Hướng dẫn sử dụng

1. Cài dependencies: `npm install`
2. Chạy server API: `npm run server`
3. Chạy app React: `npm run dev`
4. Truy cập: <http://localhost:5174/>

## Ghi chú

- Nếu cần hỗ trợ, liên hệ Trần Hoàng Duy - N24DTCN021
