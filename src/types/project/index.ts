import { Pagination } from "~/types/filters";

export interface Project {
  id: string;
  title: string;
  description: string;
  projectStatus: ProjectStatus;
}

export enum ProjectStatus {
  Draft = "DRAFT",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
}
export type ProjectPayload = Omit<Project, "id">;
export type ProjectFilters = Pagination;
