import { useState, useEffect, useRef } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Navbar from "../components/commons/Navbar";
import { useSearchParams } from "react-router-dom";
import "../components/Animations.css";
import { updateUser, deleteUser } from "../apis/api";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";

function Notification({
  message,
  type,
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 1800);
    const closeTimer = setTimeout(onClose, 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border transition-all duration-300 transform ${
        visible
          ? "animate-fade-in-down opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2"
      } ${
        type === "success"
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      <span
        className="text-lg"
        dangerouslySetInnerHTML={{
          __html:
            type === "success"
              ? "<i class='fa-solid fa-circle-check mr-1'></i>"
              : "<i class='fa-solid fa-circle-exclamation mr-1'></i>",
        }}
      />
      <span className="font-medium">{message}</span>
      <button
        className="ml-3 text-gray-400 hover:text-gray-700"
        onClick={() => setVisible(false)}
      >
        ×
      </button>
    </div>
  );
}

export default function EditProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [tab, setTab] = useState(searchParams.get("tab") || "personal");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isFacebookUser, setIsFacebookUser] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatarPreview: "",
  });

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/virusbetatester/image/upload";
  const UPLOAD_PRESET = "unsigned_upload";

  const uploadAvatarToCloudinary = async (file: File) => {
    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setAvatarPreview(data.secure_url);
        setNotification({ message: "Tải ảnh thành công!", type: "success" });
        return data.secure_url;
      } else {
        setNotification({ message: "Upload thất bại!", type: "error" });
      }
    } catch {
      setNotification({ message: "Lỗi khi upload ảnh!", type: "error" });
    } finally {
      setAvatarUploading(false);
    }
    return "";
  };

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setNotification({
        message: "Chỉ chấp nhận ảnh JPG hoặc PNG!",
        type: "error",
      });
      return;
    }
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setNotification({
        message: "Dung lượng ảnh tối đa là 2MB!",
        type: "error",
      });
      return;
    }
    await uploadAvatarToCloudinary(file);
  }

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : null;
    if (user) {
      const initialFullName = user.fullName || "";
      const initialEmail = user.email || "";
      const initialBio = user.description || "";
      const initialAvatar = user.avatarUrl || "";
      setFullName(initialFullName);
      setEmail(initialEmail);
      setBio(initialBio);
      setAvatarPreview(initialAvatar);
      setPassword((prev) => (prev ? prev : user.password || ""));
      // If user logged in via Facebook provider, disable password editing
      if (user.provider === "facebook") {
        setIsFacebookUser(true);
      }
      setInitialValues({
        fullName: initialFullName,
        email: initialEmail,
        bio: initialBio,
        avatarPreview: initialAvatar,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setNotification({
          message:
            "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa, 1 số và 1 ký tự đặc biệt!",
          type: "error",
        });
        return;
      }
    }
    try {
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || !user.id) {
        setNotification({
          message: "Không tìm thấy thông tin người dùng!",
          type: "error",
        });
        return;
      }
      const response = await updateUser(user.id, {
        fullName,
        email,
        description: bio,
        avatarUrl: avatarPreview,
        ...(password ? { password, confirmPassword: password } : {}),
      });
      if (response?.data) {
        const avatarUrlToSave =
          avatarPreview && avatarPreview.startsWith("http")
            ? avatarPreview
            : response.data.avatarUrl || "";
        const updatedUser = {
          ...response.data,
          avatarUrl: avatarUrlToSave,
          ...(password ? { password, confirmPassword: password } : {}),
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
      setNotification({
        message: "Lưu thông tin thành công!",
        type: "success",
      });
    } catch {
      setNotification({
        message: "Lỗi khi cập nhật thông tin!",
        type: "error",
      });
    }
  };

  return (
    <>
      <Navbar showUser showHomePage />
      <div className="min-h-screen bg-gray-50 pt-26 py-10 px-4 font-[inter] select-none">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hồ sơ</h1>
        <p className="text-gray-500 mb-6">
          Cập nhật thông tin và tùy chỉnh cài đặt của bạn
        </p>
        <div className="flex flex-wrap bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <button
            key="personal"
            onClick={() => {
              setTab("personal");
              setSearchParams({ tab: "personal" });
            }}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
              tab === "personal"
                ? "text-indigo-600 border-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:bg-gray-50 border-transparent"
            }`}
          >
            <span>👤</span> Thông tin cá nhân
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Thông tin cá nhân
        </h2>
        <div className="flex items-center gap-4 mb-6 relative">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 overflow-hidden relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : fullName ? (
              fullName.charAt(0).toUpperCase()
            ) : (
              "A"
            )}
            {avatarUploading && (
              <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 text-indigo-600 text-xs font-semibold rounded-full">
                Đang tải...
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Định dạng: JPG, PNG. Tối đa 2MB
            </p>
            <div className="flex gap-3 items-center">
              <label className="bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-indigo-200 hover:shadow-lg hover:scale-105 hover:text-indigo-700">
                <i className="fa-solid fa-upload mr-2"></i>Tải ảnh lên
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              <button
                className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:bg-red-100 hover:text-red-600 hover:cursor-pointer hover:shadow-lg hover:scale-105"
                type="button"
                onClick={() => {
                  setAvatarPreview("");
                  if (avatarInputRef.current)
                    avatarInputRef.current.value = "";
                }}
              >
                <i className="fa-solid fa-trash mr-2"></i>Xóa
              </button>
            </div>
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập họ và tên tại đây..."
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập email tại đây..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giới thiệu bản thân
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={bio}
              onChange={(_, editor) => {
                const data = editor.getData();
                setBio(data);
              }}
              config={{
                placeholder: "Nhập giới thiệu bản thân tại đây..."
              }}
            />
            <p className="text-sm text-gray-400 mt-1">{bio.replace(/<[^>]+>/g, "").length} / 500 ký tự</p>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={`mt-1 w-full rounded-lg border ${isFacebookUser ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-gray-50'} px-4 py-2 pr-10 shadow-sm focus:outline-none ${isFacebookUser ? '' : 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}`}
              placeholder="Nhập mật khẩu tại đây..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isFacebookUser}
            />
            <span
              className={`absolute top-1/2 right-3 transform -translate-y-1/16 ${isFacebookUser ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-indigo-600 cursor-pointer'}`}
              onClick={() => { if (!isFacebookUser) setShowPassword((prev) => !prev); }}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-red-500 hover:to-pink-600 hover:bg-gradient-to-r hover:cursor-pointer"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="fa-solid fa-trash-can mr-2"></i>Xóa tài khoản
            </button>
            {showDeleteModal && (
              <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                  const userStr = localStorage.getItem("currentUser");
                  const user = userStr ? JSON.parse(userStr) : null;
                  if (user && user.id) {
                    try {
                      await deleteUser(user.id);
                      localStorage.removeItem("currentUser");
                      setNotification({
                        message: "Xoá tài khoản thành công!",
                        type: "success",
                      });
                      setTimeout(() => navigate("/login"), 2000);
                    } catch {
                      setNotification({
                        message: "Xoá tài khoản thất bại!",
                        type: "error",
                      });
                    }
                  }
                  setShowDeleteModal(false);
                }}
                message="Bạn có chắc chắn muốn xoá tài khoản này? Hành động này không thể hoàn tác."
              />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-indigo-200 text-gray-700 font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-gray-300 hover:to-indigo-300 hover:bg-gradient-to-r hover:text-indigo-700 hover:cursor-pointer"
                onClick={() => {
                  setFullName(initialValues.fullName);
                  setEmail(initialValues.email);
                  setBio(initialValues.bio);
                  setAvatarPreview(initialValues.avatarPreview);
                  if (avatarInputRef.current)
                    avatarInputRef.current.value = "";
                  setNotification({
                    message: "Hoàn tác chỉnh sửa thành công!",
                    type: "success",
                  });
                }}
              >
                <i className="fa-solid fa-xmark mr-2"></i>Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:to-blue-600 hover:bg-gradient-to-r hover:cursor-pointer"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>Lưu
              </button>
            </div>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
