import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import dayjs from "dayjs";
import { computed, useFilters, useToggle } from "#imports";
import Notes from "~/services/notes";
import { Note, NoteFilters, NotePayload } from "~/types/notes";

export const useNotesStore = defineStore("Notes", () => {
  const {
    filters: noteFilters,
    filteredItems: notes,
    fetchFilteredItems: fetchNotes,
    loading: isLoadingNotes,
    totalFilteredItems: totalNotes,
  } = useFilters<Note, NoteFilters>(Notes, {
    page: 0,
  });

  const notesView = computed(() =>
    notes.value.map((note) => ({
      ...note,
      author: `${note.authorFirstName} ${note.authorLastName}`,
      date: dayjs(note.date).format("DD MMMM YYYY, HH:mm"),
    }))
  );

  const [isCreatingNote, toggleCreatingNote] = useToggle();

  const createNote = async (studentId: string, payload: NotePayload) => {
    toggleCreatingNote(true);

    try {
      await Notes.create(payload, { params: { studentId } });
      fetchNotes({ studentId });

      notification.success({
        message: "You successfully added new note for student",
      });
    } finally {
      toggleCreatingNote(false);
    }
  };

  return {
    notes,
    notesView,
    totalNotes,
    noteFilters,
    isCreatingNote,
    isLoadingNotes,
    fetchNotes,
    createNote,
  };
});
