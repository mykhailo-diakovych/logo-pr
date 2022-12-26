import CrudService from "~/services/crud";
import { Note, NoteFilters, NotePayload } from "~/types/notes";

class NotesService extends CrudService<Note, NoteFilters, NotePayload> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }
}

export default new NotesService("notes");
