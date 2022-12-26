import { FilterResponse, FilterSort, Pagination } from "~/types/filters";
import { Occupation } from "~/types/common";
import { Student } from "~/types/students";

export interface Course {
  id: string;
  name: string;
  occupation: Occupation;
  startDate: string;
  endDate: string;
  techStackLevel: CourseTechStackLevel;
  price: CoursePrice;
  location: CourseLocation;
  courseStatus: CourseStatus;
}
export type CourseFilters = Pagination &
  FilterSort & { courseStatus: CourseStatus };
export type CoursePayload = Omit<Course, "id" | "courseStatus"> & {
  courseStatus?: CourseStatus;
};

export enum CourseStatus {
  Draft = "DRAFT",
  Scheduled = "SCHEDULED",
  Active = "ACTIVE",
  Completed = "COMPLETED",
}

export enum CoursePrice {
  Free = "FREE",
  Paid = "PAID",
}
export enum CourseTechStackLevel {
  Entry = "ENTRY",
  Medium = "MEDIUM",
  Advanced = "ADVANCED",
}
export enum CourseLocation {
  Remote = "REMOTE",
}

export interface CourseDetails extends Pick<Course, "courseStatus"> {
  courseName: string;
  totalStudents: 0;
  startDate: string;
  endDate: string;
  students: FilterResponse<Student>;
}
