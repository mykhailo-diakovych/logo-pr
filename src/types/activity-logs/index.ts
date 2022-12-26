import { Pagination } from "~/types/filters";
import { ApplicationStatus } from "~/types/common";

export interface ActivityLog {
  id: string;
  screeningStatus: ApplicationStatus;
  authorFirstName: string;
  authorLastName: string;
  emailContent: string;
  statusComment: string;
  createdAt: string;
}

export type ActivityLogFilters = Pagination & { studentId: string };
