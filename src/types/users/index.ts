import { FilterResponse, FilterSort, Pagination } from "~/types/filters";
import { Occupation } from "~/types/common";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  occupation: Occupation;
  role: UserRole;
  jobTitle: string;
}

export interface UserUpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
export type UsersResponse = FilterResponse<User>;
export type UsersFilters = Pagination & FilterSort;
export type UsersPayload = Omit<User, "id"> & {
  password?: string;
};

export enum UserRole {
  Admin = "ROLE_ADMIN",
  Mentor = "ROLE_MENTOR",
  Student = "ROLE_STUDENT",
}
