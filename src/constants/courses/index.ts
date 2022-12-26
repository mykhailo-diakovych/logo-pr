import { CourseStatus } from "~/types/courses";

export const coursesStatusColor: Record<CourseStatus, string> = {
  [CourseStatus.Draft]: "text-peach",
  [CourseStatus.Scheduled]: "text-red",
  [CourseStatus.Active]: "text-peach",
  [CourseStatus.Completed]: "text-green",
};
