import { DefineComponent } from "vue";
import { User } from "~/types/users";
import {
  FilterResponse,
  FilterSearch,
  FilterSort,
  Pagination,
} from "~/types/filters";
import {
  Address,
  ApplicationStatus,
  LogoFile,
  EnglishLevel,
  Gender,
  Occupation,
} from "~/types/common";
import { ProfilePicture } from "~/types/profile";

export interface Student extends User {
  age: number;
  appliedAt: string;
  gender: Gender;
  dateOfBirth: string;
  education: string;
  englishLevel: EnglishLevel;
  personalInformation: string;
  screeningStatus: ApplicationStatus;
  address: Address;
  occupation: Occupation;
  studentStatus: StudentStatus;
  mentorDetails: StudentMentor | null;
  coverLetter: string;
  resume: LogoFile | null;
  profilePicture: ProfilePicture | null;
}

interface StudentMentor {
  id: string;
  firstName: string;
  lastName: string;
}

export interface StudentUpdatePayload {
  mentorId: string;
}

export type StudentsResponse = FilterResponse<Student>;
export type StudentsFilters = Pagination &
  FilterSort &
  FilterSearch & {
    studentStatus: StudentStatus;
  };

export enum StudentStatus {
  Applied = "APPLIED",
  Active = "ACTIVE",
  Rejected = "REJECTED",
  Former = "GRADUATED",
  Excluded = "EXCLUDED",
}

export interface StudentApplicationPayload {
  emailContent: string;
  statusComment: string;
}
export type StudentApplicationRejectPayload = StudentApplicationPayload;
export interface StudentApplicationScreeningPayload
  extends StudentApplicationPayload {
  screeningStatus: ApplicationStatus;
  academyTaskId?: string;
}
export interface StudentApplicationAcceptPayload
  extends StudentApplicationPayload {
  mentorId: string;
}

export interface StudentInformationOption {
  title: string;
  key: keyof Student;

  component?: DefineComponent<{}, {}, any>;
  props?: Record<string, unknown>;
}

interface StudentDetailAction {
  title: string;
  class?: string;
  handler(): void;
}
interface StudentDetailActionDivider {
  divider: boolean;
}
export type StudentDetailActions = (
  | StudentDetailAction
  | StudentDetailActionDivider
)[];

export type StudentTasksFilters = Pagination & { studentId: string };
