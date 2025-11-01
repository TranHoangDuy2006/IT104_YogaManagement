export function validateEmail(email: string): boolean {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}

export interface EditUser {
  fullName: string;
  email: string;
  role: string;
}

export function validateEditUser(editUser: EditUser): string | null {
  if (!editUser.fullName.trim()) {
    return "Họ và tên không được để trống!";
  }
  if (!editUser.email.trim()) {
    return "Email không được để trống!";
  }
  if (!validateEmail(editUser.email.trim())) {
    return "Email không hợp lệ!";
  }
  return null;
}
