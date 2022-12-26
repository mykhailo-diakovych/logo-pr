import { Pagination } from "~/types/filters";

export interface Note {
  id: string;
  date: string;
  authorFirstName: string;
  authorLastName: string;
  note: string;
  title: string;
}
export type NoteFilters = Pagination & { studentId?: string };

export type NotePayload = Pick<Note, "note" | "title">;
