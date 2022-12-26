import { Occupation, Rate as SolutionRate } from "~/types/common";
import { FilterSort, Pagination } from "~/types/filters";

export interface Task {
  id: string;
  title: string;
  description: string;
  academyTask: TasksType;
  occupation: Occupation;
}

export interface TaskSolution {
  id: string;
  solution: string;
  solutionStatus: TaskSolutionType;
  solutionStatusAppliedAt: string;
}

export interface Rate {
  id: string;
  rateValue: string;
  feedback: string;
}

export interface TaskDetail {
  id: string;
  title: string;
  description: string;
  academyTask: TasksType;
  occupation: string;
  academyTaskSolution: TaskSolution;
  rate: Rate;
}

export type TasksPayload = Omit<Task, "id">;

export type TasksFilters = Pagination &
  FilterSort &
  Partial<{
    academyTasks: TasksType[];
    occupations: Occupation[];
  }>;

export enum TasksType {
  Application = "APPLICATION",
  OnBoarding = "ONBOARDING",
  Active = "ACTIVE",
  Final = "FINAL",
}

export enum TaskSolutionType {
  Open = "OPEN",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Submitted = "SUBMITTED",
}

export interface TaskFeedback {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  submittedDate: string;
  rateValue: SolutionRate;
  feedback: string;
}

export interface TaskSummary {
  total: number;
  approved: number;
}
