<template>
  <section>
    <header-teleport-left>
      <div class="flex items-center gap-x-10">
        <nuxt-link
          :to="teamDetailsPath"
          class="text-xl text-violet cursor-pointer flex items-center hover:text-violet"
        >
          <arrow-left-outlined />
        </nuxt-link>
        <h1 class="text-xl font-medium leading-6 text-violet mb-0">
          Review notes
        </h1>
      </div>
    </header-teleport-left>

    <c-table
      v-model:current="noteFilters.page"
      :items="notesView"
      :total="totalNotes"
      :loading="isLoadingNotes"
      :columns="tableColumns"
      :scroll="{ y: 'calc(100vh - 250px)' }"
      field-to-expanded="note"
      use-expanded-row
    />
  </section>
</template>

<script lang="ts" setup>
import { useRoute } from "#app";
import { storeToRefs } from "pinia";
import { ColumnsType } from "ant-design-vue/es/table";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import { computed } from "#imports";
import CTable from "~/components/ui/CTable.vue";
import { useNotesStore } from "~/store/notes/useNotesStore";

const route = useRoute();
const teamId = computed(() => route.params.id as string);
const studentId = computed(() => route.params.studentId as string);
const teamDetailsPath = computed(() => `/teams/${teamId.value}`);

const notesStore = useNotesStore();
const { notesView, isLoadingNotes, totalNotes, noteFilters } =
  storeToRefs(notesStore);

noteFilters.value.studentId = studentId.value;

const tableColumns: ColumnsType = [
  { title: "Date", key: "date", dataIndex: "date", width: "25%" },
  { title: "Author", key: "author", dataIndex: "author" },
  { title: "Note", key: "note", dataIndex: "note" },
];
</script>

<style lang="scss">
.c-table__column--note {
  p {
    @apply opacity-0 first-of-type:opacity-100 transition-all duration-500;
  }

  &.expand p {
    @apply opacity-100;
  }
}
</style>
