import { TasksType } from "~/types/tasks";

export const tableStatusColors: Record<TasksType, string> = {
  [TasksType.Final]: "purple",
  [TasksType.Active]: "orange",
  [TasksType.OnBoarding]: "blue",
  [TasksType.Application]: "green",
};
