import { useMemo } from "react";
import type { Course } from "../types/Course";

export function useSortedCourses(courses: Course[]) {
  return useMemo(
    () => [...courses].sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" })),
    [courses]
  );
}
