import { Student } from "~/types/students";
import { Pagination } from "~/types/filters";
import { Address, LogoFile } from "~/types/common";

export interface Team {
  id: string;
  name: string;
  studentsCount: number;
  projectName: string;
  teamStatus: TeamStatus;
  students: Student[];
}

interface TeamResponseStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mentorFirstName: string | null;
  mentorLastName: string | null;
  profilePicture?: LogoFile | null;
  address: Address;
}

export interface TeamStudent extends TeamResponseStudent {
  mentorFullName: string;
}

export interface TeamResponse {
  id: string;
  name: string;
  updatedAt: string;
  students: TeamResponseStudent[];
  teamStatus: TeamStatus;
  statusComment: string | null;
}

export interface CreateTeamDto {
  name: string;
  projectId: string;
  studentIds: string[];
  managerId: string;
}

export enum TeamStatus {
  Issues = "ISSUES",
  OnTrack = "ON_TRACK",
}

export interface TeamUpdateStatusDto {
  teamStatus: TeamStatus;
  statusComment: string;
}

export type TeamFilters = Pagination;
