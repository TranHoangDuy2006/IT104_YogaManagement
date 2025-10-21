import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Sidebar from "../components/commons/Sidebar";
import ConfirmDeleteModal from "../components/forms/ConfirmDeleteModal";
import type { AppDispatch } from "../stores/userStore";
import { deleteUser, updateUser, addUser } from "../slices/userSlice";

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

type Booking = {
  id: string;
  userId: string;
  class: string;
  date: string;
  time: string;
  name: string;
  email: string;
};

export default function UserManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // Lấy thông tin admin hiện tại
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setAdminEmail(currentUser.email);
  }, []);

  // Fetch users (trừ admin)
  useEffect(() => {
    axios.get<User[]>("http://localhost:1904/users").then((res) => {
      setUsers(res.data.filter((u) => u.email !== adminEmail));
    });
  }, [adminEmail]);

  // Fetch bookings theo user
  useEffect(() => {
    if (selectedUser) {
      axios
        .get<Booking[]>(
          "http://localhost:1904/bookings?userId=" + selectedUser.id
        )
        .then((res) => setBookings(res.data));
    } else {
      setBookings([]);
    }
  }, [selectedUser]);

  return (
    <div className="min-h-screen w-full font-[inter] bg-gray-50 select-none flex flex-row">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Quản lý người dùng</h2>

        {/* Danh sách user */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <button
            className="mb-4 px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 hover:cursor-pointer flex items-center gap-2"
            onClick={() => setAddModalOpen(true)}
          >
            <i className="fa-solid fa-user-plus"></i> Thêm người dùng
          </button>

          {/* Modal thêm người dùng */}
          {addModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
    <div className="bg-white dark:bg-white-700 rounded-2xl shadow-2xl w-[420px] max-w-full p-6 sm:p-8 relative animate-fadeIn">
      {/* Nút đóng */}
      <button
        onClick={() => setAddModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
      >
        <i className="fa-solid fa-xmark text-xl"></i>
      </button>

      {/* Tiêu đề */}
      <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-black mb-6">
        Thêm người dùng mới
      </h3>

      {/* Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const userToAdd = { ...newUser, id: Date.now().toString() };
          await dispatch(addUser(userToAdd));
          setUsers([...users, userToAdd]);
          setAddModalOpen(false);
          setNewUser({
            id: "",
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
          });
        }}
        className="flex flex-col gap-4"
      >
        {/* Họ tên */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
            placeholder="Nhập họ và tên..."
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            placeholder="Nhập email..."
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Mật khẩu */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Nhập mật khẩu..."
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
            placeholder="Nhập lại mật khẩu..."
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Vai trò
          </label>
          <select
            value={newUser.role}
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setAddModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition-colors"
          >
            <i className="fa-solid fa-xmark mr-2"></i>Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all"
          >
            <i className="fa-solid fa-save mr-2"></i> Lưu
          </button>
        </div>
      </form>
    </div>
  </div>
)}

          {/* Bảng người dùng */}
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Họ tên</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{u.fullName}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-row gap-[10px]">
                      <button
                        className="px-3 py-1 rounded bg-blue-100 text-blue-600 font-semibold hover:bg-blue-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
                        onClick={() => setSelectedUser(u)}
                      >
                        <i className="fa-solid fa-calendar-days"></i> Lịch
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setEditUser(u);
                          setEditModalOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Sửa
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-100 text-red-600 font-semibold hover:bg-red-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setUserToDelete(u);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal xác nhận xóa */}
        {deleteModalOpen && userToDelete && (
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={async () => {
              await dispatch(deleteUser(userToDelete.id));
              setUsers(users.filter((u) => u.id !== userToDelete.id));
              setDeleteModalOpen(false);
              setUserToDelete(null);
            }}
          />
        )}

        {/* Modal chỉnh sửa */}
        {editModalOpen && editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
              className="bg-white rounded-lg shadow-lg p-8 w-[400px] flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                await dispatch(updateUser({ id: editUser.id, user: editUser }));
                setUsers(
                  users.map((u) => (u.id === editUser.id ? editUser : u))
                );
                setEditModalOpen(false);
              }}
            >
              <h3 className="text-xl font-bold mb-2">
                Sửa thông tin người dùng
              </h3>
              <input
                type="text"
                className="border rounded px-3 py-2"
                value={editUser.fullName}
                onChange={(e) =>
                  setEditUser({ ...editUser, fullName: e.target.value })
                }
              />
              <input
                type="text"
                className="border rounded px-3 py-2"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <input
                type="text"
                className="border rounded px-3 py-2"
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              />
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500"
                  onClick={() => setEditModalOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i> Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                >
                  <i className="fa-solid fa-save"></i> Lưu
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lịch người dùng */}
        {selectedUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">
              Lịch của {selectedUser.fullName}
            </h3>
            <table className="min-w-full mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Lớp học</th>
                  <th className="px-4 py-2 text-left">Ngày</th>
                  <th className="px-4 py-2 text-left">Khung giờ</th>
                  <th className="px-4 py-2 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{b.class}</td>
                    <td className="px-4 py-2">{b.date}</td>
                    <td className="px-4 py-2">{b.time}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-row gap-[5px]">
                        <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-500 hover:text-white flex items-center gap-2">
                          <i className="fa-solid fa-pen-to-square"></i> Sửa
                        </button>
                        <button className="px-3 py-1 rounded bg-red-100 text-red-600 font-semibold hover:bg-red-500 hover:text-white flex items-center gap-2">
                          <i className="fa-solid fa-trash"></i> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Thêm lịch
            </button>
            <button
              className="ml-4 px-4 py-2 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500 flex items-center gap-2"
              onClick={() => setSelectedUser(null)}
            >
              <i className="fa-solid fa-xmark"></i> Đóng
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
