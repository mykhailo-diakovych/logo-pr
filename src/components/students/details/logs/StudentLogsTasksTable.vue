<template>
  <c-table
    v-model:current="studentTasksFilters.page"
    :columns="tableColumns"
    :items="studentAllTasks"
    :total="totalStudentTasks"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'review'">
        <nuxt-link :to="`${studentId}/task/${record.id}`">
          <span class="text-blue cursor-pointer"> Review </span>
        </nuxt-link>
      </template>
    </template>
  </c-table>
</template>

<script lang="ts" setup>
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import { useRoute } from "#app";
import CTable from "~/components/ui/CTable.vue";
import { useStudentStore } from "~/store/students/useStudentStore";
import { computed } from "#imports";

const studentId = computed(() => useRoute().params.id);
const { studentAllTasks, studentTasksFilters, totalStudentTasks } = storeToRefs(
  useStudentStore()
);

const tableColumns: ColumnsType = [
  { title: "Title", key: "title", dataIndex: "title", width: "15.25rem" },
  {
    title: "Description",
    key: "description",
    dataIndex: "description",
    width: "46.375rem",
  },
  {
    title: "Status",
    key: "solutionStatus",
    dataIndex: "solutionStatus",
    width: "13.375rem",
  },
  { title: "", key: "review", dataIndex: "review" },
];
</script>
