import type { User } from "./User";

export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => Promise<void>;
  newUser: User;
  setNewUser: React.Dispatch<React.SetStateAction<User>>;
}
