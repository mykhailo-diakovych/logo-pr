import { Pagination } from "~/types/filters";

export interface WeeklyUpdate {
  id: string;
  achievement: string;
  obstacle: string;
  goals: string[];
  updatingUntil: string;
  weeklyUpdateProgress: string;
  createAt: string;
  updateAt: string;
  firstDayOfWeek: string;
  lastDayOfWeek: string;
}
export type WeeklyUpdatesFilters = Pagination & { studentId: string };

export enum WeeklyUpdateProgress {
  Fine = "FINE",
  Poorly = "POORLY",
  Excellent = "EXCELLENT",
}

export interface WeeklyUpdateSummary {
  total: number;
  completed: number;
}
