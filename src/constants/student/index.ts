import { StudentStatus } from "~/types/students";

export const studentStatusColors: Record<StudentStatus, string> = {
  [StudentStatus.Applied]: "text-green",
  [StudentStatus.Active]: "text-green",
  [StudentStatus.Former]: "text-peach",
  [StudentStatus.Excluded]: "text-red",
  [StudentStatus.Rejected]: "text-red",
};
