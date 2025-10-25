
# Yoga Management Project

## Chức năng chính

- Đăng ký, đăng nhập, xác thực người dùng bằng JWT
- Quản lý người dùng (admin): thêm, sửa, xoá user
- Quản lý lịch tập: đặt lịch, sửa/xoá lịch, xem lịch của từng user
- Quản lý dịch vụ yoga: thêm, sửa, xoá dịch vụ
- Giao diện responsive, tối ưu cho desktop/mobile
- Sử dụng Redux Toolkit, React Router, TailwindCSS, FontAwesome

## Cập nhật nổi bật (25/10/2025)

- Lưu thông tin user bằng JWT, giải mã bằng jwt-decode ở các component
- Nếu user là admin, tên hiển thị màu đỏ và icon user đổi thành fa-user-secret
- Loại bỏ viền đen khi focus input/select, chỉ còn viền xanh
- Tối ưu UI/UX cho Navbar, modal, bảng dữ liệu

## Hướng dẫn sử dụng

1. Cài dependencies: `npm install`
2. Chạy server API: `npm run server`
3. Chạy app React: `npm run dev`
4. Truy cập: <http://localhost:5174/>

## Ghi chú

- Demo bảo mật JWT ở frontend, không dùng cho production
- Nếu cần hỗ trợ, liên hệ Trần Hoàng Duy - N24DTCN021
