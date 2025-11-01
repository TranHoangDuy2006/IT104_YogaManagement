import type { User } from "./User";

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
  editUser: User;
  setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
}
