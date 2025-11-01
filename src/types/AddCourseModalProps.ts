import type { Course } from "./Course";

export interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, "id">) => void;
  course?: Course | null;
}
