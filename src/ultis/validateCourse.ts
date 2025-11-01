export interface CourseInput {
  name: string;
  description: string;
  image: string;
}

export function validateCourseInput(course: CourseInput): string | null {
  if (!course.name.trim() || !course.description.trim() || !course.image.trim()) {
    return "Vui lòng điền đầy đủ thông tin lớp học!";
  }
  return null;
}
