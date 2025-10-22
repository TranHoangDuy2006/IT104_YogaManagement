import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import ConfirmDeleteModal from "../components/forms/ConfirmDeleteModal";
import AddUserModal from "../components/forms/AddUserModal";
import EditUserModal from "../components/forms/EditUserModal";
import type { AppDispatch } from "../stores/userStore";
import { deleteUser, updateUser, addUser } from "../slices/userSlice";
import { fetchBookingsByUser } from "../slices/fetchBookingsByUserThunk";
import type { Booking } from "../slices/bookingSlice";

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export default function UserManagementPage() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [bookingsByUser, setBookingsByUser] = useState<Record<string, Booking[]>>({});
  const [loadingBookingsId, setLoadingBookingsId] = useState<string | null>(null);
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

  return (
    <div className="min-h-screen w-full font-[inter] bg-gray-50 flex select-none">
      <main className="flex-1">
        {location.pathname === "/admin/users-management" && (
          <>
            <h2 className="text-[29px] font-bold mb-6">Quản lý người dùng</h2>

            {/* Danh sách user */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <button
                className="mb-4 px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 hover:cursor-pointer flex items-center gap-2"
                onClick={() => setAddModalOpen(true)}
              >
                <i className="fa-solid fa-user-plus" /> Thêm người dùng
              </button>

              {/* Modal thêm người dùng */}
              <AddUserModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                newUser={newUser}
                setNewUser={setNewUser}
                onSubmit={async (user) => {
                  await dispatch(addUser(user));
                  setUsers([...users, user]);
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
              />

              {/* Bảng danh sách người dùng */}
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
                    <React.Fragment key={u.id}>
                      <tr className="hover:bg-gray-100">
                        <td className="px-4 py-2">{u.fullName}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.role}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-3">
                            <button
                              className="px-5 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold text-base hover:bg-yellow-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setEditUser(u);
                                setEditModalOpen(true);
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square" /> Sửa
                            </button>
                            <button
                              className="px-5 py-2 rounded-lg bg-red-100 text-red-600 font-semibold text-base hover:bg-red-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setUserToDelete(u);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <i className="fa-solid fa-trash" /> Xóa
                            </button>
                            <button
                              className={`px-5 py-2 rounded-lg font-semibold text-base flex items-center gap-2 hover:cursor-pointer
                                ${expandedUserId === u.id
                                  ? 'bg-gray-200 text-gray-700 hover:bg-purple-400 hover:text-white'
                                  : 'bg-blue-100 text-blue-700 hover:bg-purple-500 hover:text-white'}
                              `}
                              onClick={async () => {
                                const id = u.id;
                                if (expandedUserId === id) {
                                  setExpandedUserId(null);
                                  return;
                                }
                                setExpandedUserId(id);
                                // nếu đã load thì không load lại
                                if (bookingsByUser[id]) return;
                                setLoadingBookingsId(id);
                                try {
                                  const res = await dispatch(fetchBookingsByUser(id));
                                  const payload = (res as unknown as { payload?: Booking[] }).payload;
                                  setBookingsByUser((prev) => ({ ...prev, [id]: payload || [] }));
                                } catch (err) {
                                  console.error("Lỗi khi tải lịch của user", err);
                                  setBookingsByUser((prev) => ({ ...prev, [id]: [] }));
                                } finally {
                                  setLoadingBookingsId(null);
                                }
                              }}
                            >
                              <i className={`fa-solid fa-calendar-days mr-2 ${expandedUserId === u.id ? 'text-gray-500' : 'text-blue-500'}`} />
                              {expandedUserId === u.id ? 'Ẩn Lịch' : 'Mở Lịch'}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedUserId === u.id && (
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="py-6 bg-white">
                            {loadingBookingsId === u.id ? (
                              <div>Đang tải lịch...</div>
                            ) : (
                              <div>
                                {(bookingsByUser[u.id] || []).length === 0 ? (
                                  <div className="text-sm text-gray-500">Chưa có lịch</div>
                                ) : (
                                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow">
                                    <thead className="bg-blue-50">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-blue-700">Ngày</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-blue-700">Giờ</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-blue-700">Lớp học</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-blue-700">Tên</th>
                                        <th className="px-3 py-2 text-left text-sm font-semibold text-blue-700">Email</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(bookingsByUser[u.id] || []).map((b) => (
                                        <tr key={b.id} className="hover:bg-blue-100">
                                          <td className="px-3 py-2 text-gray-700">{b.date}</td>
                                          <td className="px-3 py-2 text-gray-700">{b.time}</td>
                                          <td className="px-3 py-2 text-gray-700">{b.class}</td>
                                          <td className="px-3 py-2 text-gray-700">{b.name}</td>
                                          <td className="px-3 py-2 text-gray-700">{b.email}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
                  // Xoá tất cả bookings của user
                  try {
                    const bookingsRes = await axios.get(`http://localhost:1904/bookings?userId=${userToDelete.id}`);
                    const bookings: { id: string }[] = bookingsRes.data;
                    await Promise.all(
                      bookings.map((b) => axios.delete(`http://localhost:1904/bookings/${b.id}`))
                    );
                  } catch (e) {
                    console.error("Lỗi khi xoá bookings của người dùng!", e);
                  }
                  setDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
              />
            )}

            {/* Modal chỉnh sửa người dùng */}
            {editModalOpen && editUser && (
              <EditUserModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                editUser={editUser}
                setEditUser={setEditUser}
                onSubmit={async (user) => {
                  await dispatch(updateUser({ id: user.id, user }));
                  setUsers(users.map((u) => (u.id === user.id ? user : u)));
                  setEditModalOpen(false);
                }}
              />
            )}
          </>
        )}

        <Outlet />
      </main>
    </div>
  );
}
