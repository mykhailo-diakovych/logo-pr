import { User } from "~/types/users";

export interface ProfilePicture {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}
export interface Profile extends User {
  profilePicture: ProfilePicture | null;
  active: boolean;
}
