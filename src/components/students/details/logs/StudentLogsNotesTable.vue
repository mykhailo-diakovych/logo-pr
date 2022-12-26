<template>
  <c-table
    v-model:current="noteFilters.page"
    :total="totalNotes"
    :items="notesView"
    :columns="tableColumns"
    :loading="isLoadingNotes"
    field-to-expanded="note"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'review'">
        <span
          class="text-blue cursor-pointer"
          @click="onClickReviewNote(record)"
        >
          Review
        </span>
      </template>
    </template>
  </c-table>

  <student-review-note-modal
    v-model:visible="isNoteReviewModalActive"
    :text="selectedNote"
  />
</template>

<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import CTable from "~/components/ui/CTable.vue";
import { useNotesStore } from "~/store/notes/useNotesStore";
import { ref, useToggle } from "#imports";
import { Note } from "~/types/notes";
import StudentReviewNoteModal from "~/components/students/details/modals/review/StudentReviewNoteModal.vue";

const tableColumns: ColumnsType = [
  { title: "Date/Time", dataIndex: "date", key: "date" },
  { title: "Author", dataIndex: "author", key: "author" },
  { title: "Note", dataIndex: "note", key: "note", width: "70%" },
  { title: "", dataIndex: "review", key: "review" },
];

const { notesView, isLoadingNotes, totalNotes, noteFilters } = storeToRefs(
  useNotesStore()
);

const selectedNote = ref("");
const [isNoteReviewModalActive, toggleNoteReviewModal] = useToggle();

const onClickReviewNote = ({ note }: Note) => {
  selectedNote.value = note;
  toggleNoteReviewModal(true);
};
</script>
