import React, { useEffect, useState } from "react";
import '../components/Animations.css';
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { getUsers, getBookingsByUser, deleteBooking } from "../apis/api";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import AddUserModal from "../components/modals/AddUserModal";
import { validateNewUser } from "../ultis/validateUser";
import EditUserModal from "../components/modals/EditUserModal";
import AddScheduleForUserModal from "../components/modals/AddScheduleForUserModal";
import type { AppDispatch } from "../stores/userStore";
import { deleteUser, updateUser, addUser } from "../slices/userSlice";
import { fetchBookingsByUser } from "../slices/fetchBookingsByUserThunk";
import { addBooking } from "../slices/bookingSlice";
import type { Booking } from "../slices/bookingSlice";
import type { User } from "../types/User";

function Notification({ message, show }: { message: string, show: boolean }) {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    if (!show) {
      setTimeout(() => setVisible(false), 400);
    } else {
      setVisible(true);
    }
  }, [show]);
  if (!visible) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-[60px] z-50 font-[inter] select-none">
      <div className={`bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${show ? 'animate-fade-in' : 'animate-fade-out'}`}>
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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

  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    const currentUser = userStr ? JSON.parse(userStr) : {};
    setAdminEmail(currentUser.email || "");
  }, []);

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(
        res.data
          .filter((u) => u.email !== adminEmail)
          .map((u) => ({
            ...u,
            id: u.id ? String(u.id) : "",
            confirmPassword: u.confirmPassword ?? "",
            role: u.role ?? "user",
          }))
      );
    });
  }, [adminEmail]);

  return (
    <div className="min-h-screen w-full font-[inter] bg-gray-50 flex select-none">
      <main className="flex-1">
        {location.pathname === "/admin/users-management" && (
          <>
            <h2 className="text-[29px] font-bold mb-6 bg-gray-50">Quản lý người dùng</h2>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="px-4 py-2 rounded bg-[#2b80ff] text-white font-semibold hover:bg-blue-700 hover:cursor-pointer flex items-center gap-2"
                  onClick={() => setAddModalOpen(true)}
                >
                  <i className="fa-solid fa-user-plus" /> Thêm người dùng
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 hover:cursor-pointer flex items-center gap-2"
                  onClick={() => setAddScheduleModalOpen(true)}
                >
                  <i className="fa-solid fa-calendar-plus" /> Thêm lịch mới
                </button>
              </div>

              <AddUserModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                newUser={newUser}
                setNewUser={setNewUser}
                onSubmit={async (user) => {
                  const error = validateNewUser({
                    fullName: user.fullName,
                    email: user.email,
                    password: user.password,
                    confirmPassword: user.confirmPassword,
                  });
                  if (error) {
                    setErrorMsg(error);
                    setTimeout(() => setErrorMsg("") , 2000);
                    return;
                  }
                  await dispatch(addUser(user));
                  setUsers([...users, user]);
                  setSuccessMsg("Thêm người dùng thành công!");
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 1800);
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

              {addScheduleModalOpen && (
                <AddScheduleForUserModal
                  users={users}
                  bookings={[]}
                  onSave={async (booking) => {
                    await dispatch(addBooking(booking));
                    setSuccessMsg("Thêm lịch mới thành công!");
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 1800);
                    setAddScheduleModalOpen(false);
                  }}
                  onClose={() => setAddScheduleModalOpen(false)}
                />
              )}

              {showSuccess && <Notification message={successMsg} show={showSuccess} />}
              {errorMsg && (
                <Notification message={errorMsg} show={true} />
              )}

              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-center bg-gray-200 rounded-tl-lg text-lg">Họ và tên</th>
                    <th className="px-6 py-3 text-center bg-gray-200 text-lg">Email</th>
                    <th className="px-6 py-3 text-center bg-gray-200 text-lg">Vai trò</th>
                    <th className="px-6 py-3 text-center bg-gray-200 rounded-tr-lg text-lg">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <React.Fragment key={u.id}>
                      <tr className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-center">{u.fullName}</td>
                        <td className="px-4 py-2 text-center">{u.email}</td>
                        <td className="px-4 py-2 text-center">{u.role}</td>

                        <td className="px-4 py-2">
                          <div className="flex gap-3 justify-center align-middle">
                            <button
                              className="px-5 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-500 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setEditUser(u);
                                setEditModalOpen(true);
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square" /> Sửa
                            </button>

                            <button
                              className="px-5 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 hover:cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setUserToDelete(u);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <i className="fa-solid fa-trash" /> Xóa
                            </button>

                            <button
                              className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                                expandedUserId === u.id
                                  ? "bg-gray-200 text-gray-700 hover:bg-purple-400 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 hover:cursor-pointer"
                                  : "bg-blue-100 text-blue-700 hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 hover:cursor-pointer"
                              }`}
                              onClick={async () => {
                                const id = u.id;
                                if (expandedUserId === id) {
                                  setExpandedUserId(null);
                                  return;
                                }
                                setExpandedUserId(id);
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
                              <i
                                className={`fa-solid fa-calendar-days mr-1 ${
                                  expandedUserId === u.id ? "text-gray-500" : "text-blue-500"
                                }`}
                              />
                              {expandedUserId === u.id ? "Ẩn Lịch Tập" : "Mở Lịch Tập"}
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
                                        <th className="px-3 py-2 text-sm font-semibold text-blue-700 text-center">Ngày</th>
                                        <th className="px-3 py-2 text-sm font-semibold text-blue-700 text-center">Giờ</th>
                                        <th className="px-3 py-2 text-sm font-semibold text-blue-700 text-center">Lớp học</th>
                                        <th className="px-3 py-2 text-sm font-semibold text-blue-700 text-center">Tên</th>
                                        <th className="px-3 py-2 text-sm font-semibold text-blue-700 text-center">Email</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(bookingsByUser[u.id] || []).map((b) => (
                                        <tr key={b.id} className="hover:bg-blue-100">
                                          <td className="px-3 py-2 text-gray-700 text-center">{(() => {
                                            if (!b.date) return "";
                                            const d = new Date(b.date);
                                            if (isNaN(d.getTime())) return b.date;
                                            const day = String(d.getDate()).padStart(2, '0');
                                            const month = String(d.getMonth() + 1).padStart(2, '0');
                                            const year = d.getFullYear();
                                            return `${day}-${month}-${year}`;
                                          })()}</td>
                                          <td className="px-3 py-2 text-gray-700 text-center">{b.time}</td>
                                          <td className="px-3 py-2 text-gray-700 text-center">{b.class}</td>
                                          <td className="px-3 py-2 text-gray-700 text-center">{b.name}</td>
                                          <td className="px-3 py-2 text-gray-700 text-center">{b.email}</td>
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

            {deleteModalOpen && userToDelete && (
                <ConfirmDeleteModal
                  isOpen={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  onConfirm={async () => {
                    await dispatch(deleteUser(userToDelete.id));
                    setUsers(users.filter((u) => u.id !== userToDelete.id));

                    try {
                      const bookingsRes = await getBookingsByUser(userToDelete.id);
                      const bookings = bookingsRes.data;
                      await Promise.all(bookings.map((b) => deleteBooking(Number(b.id))));
                    } catch (e) {
                      console.error("Lỗi khi xoá lịch tập của người dùng!", e);
                    }

                    setSuccessMsg("Đã xoá người dùng thành công!");
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 1800);

                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  message="Bạn có chắc chắn muốn xoá người dùng này không? Hành động này không thể hoàn tác."
                />
            )}

            {editModalOpen && editUser && (
              <EditUserModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                editUser={editUser}
                setEditUser={setEditUser}
                onSubmit={async (user) => {
                  await dispatch(updateUser({ id: user.id, user }));
                  setUsers(users.map((u) => (u.id === user.id ? user : u)));
                  setSuccessMsg("Cập nhật thông tin người dùng thành công!");
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 2000);
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
