import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { getUsers, getBookingsByUser, deleteBooking } from "../apis/api";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import AddUserModal from "../components/modals/AddUserModal";
import EditUserModal from "../components/modals/EditUserModal";
import type { AppDispatch } from "../stores/userStore";
import { deleteUser, updateUser, addUser } from "../slices/userSlice";
import { fetchBookingsByUser } from "../slices/fetchBookingsByUserThunk";
import type { Booking } from "../slices/bookingSlice";
import type { User } from "../types/User";

// Component hiển thị thông báo
function Notification({ message }: { message: string }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
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
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(.4,0,.2,1) forwards;
        }
      `}</style>
    </div>
  );
}

export default function UserManagementPage() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [users, setUsers] = useState<User[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
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

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setAdminEmail(currentUser.email);
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
            <h2 className="text-[29px] font-bold mb-6">Quản lý người dùng</h2>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <button
                className="mb-4 px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 hover:cursor-pointer flex items-center gap-2"
                onClick={() => setAddModalOpen(true)}
              >
                <i className="fa-solid fa-user-plus" /> Thêm người dùng
              </button>

              <AddUserModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                newUser={newUser}
                setNewUser={setNewUser}
                onSubmit={async (user) => {
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

              {showSuccess && <Notification message={successMsg} />}

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
                              className="px-5 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setEditUser(u);
                                setEditModalOpen(true);
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square" /> Sửa
                            </button>

                            <button
                              className="px-5 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-500 hover:text-white hover:cursor-pointer flex items-center gap-2"
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
                                  ? "bg-gray-200 text-gray-700 hover:bg-purple-400 hover:text-white hover:cursor-pointer"
                                  : "bg-blue-100 text-blue-700 hover:bg-purple-500 hover:text-white hover:cursor-pointer"
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
                              {expandedUserId === u.id ? "Ẩn Lịch" : "Mở Lịch"}
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
                    console.error("Lỗi khi xoá bookings của người dùng!", e);
                  }

                  setDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
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
                  setTimeout(() => setShowSuccess(false), 1800);
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
