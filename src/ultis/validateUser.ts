export function validateEmail(email: string): boolean {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}

export function validateNewUser(newUser: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): string | null {
  if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.confirmPassword.trim()) {
    return "Vui lòng điền đầy đủ thông tin!";
  }
  if (newUser.password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 kí tự!";
  }
  if (!validateEmail(newUser.email.trim())) {
    return "Email không hợp lệ!";
  }
  if (newUser.password !== newUser.confirmPassword) {
    return "Mật khẩu xác nhận không khớp!";
  }
  return null;
}
