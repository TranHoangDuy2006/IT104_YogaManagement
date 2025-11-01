import type { Course } from "./Course";

export interface EditCoursesForServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedCourseIds: string[]) => void;
  allCourses: Course[];
  selectedCourseIds: string[];
}
