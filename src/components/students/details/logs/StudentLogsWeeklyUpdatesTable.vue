<template>
  <c-table
    :columns="tableColumns"
    :items="weeklyUpdatesView"
    :total="totalWeeklyUpdates"
    :loading="isLoadingWeeklyUpdates"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'review'">
        <span
          class="text-blue cursor-pointer"
          @click="onClickReviewWeeklyUpdate(record)"
        >
          Review
        </span>
      </template>
    </template>
  </c-table>
  <student-review-weekly-update-modal
    v-if="selectedWeeklyUpdate"
    v-model:visible="isReviewWeeklyUpdateModalActive"
    :weekly-update="selectedWeeklyUpdate"
  />
</template>

<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import CTable from "~/components/ui/CTable.vue";
import { useWeeklyUpdatesStore } from "~/store/weekly-updates/useWeeklyUpdatesStore";
import StudentReviewWeeklyUpdateModal from "~/components/students/details/modals/review/StudentReviewWeeklyUpdateModal.vue";
import { ref, useToggle } from "#imports";
import { WeeklyUpdate } from "~/types/weekly-updates";

const tableColumns: ColumnsType = [
  {
    title: "Week",
    dataIndex: "firstDayOfWeek",
    key: "firstDayOfWeek",
    width: "155px",
  },
  {
    title: "Date update",
    dataIndex: "updateAt",
    key: "updateAt",
    width: "150px",
  },
  {
    title: "Accomplishments",
    dataIndex: "achievement",
    key: "achievement",

    width: "759px",
  },
  {
    title: "",
    dataIndex: "review",
    key: "review",
  },
];

const { weeklyUpdatesView, isLoadingWeeklyUpdates, totalWeeklyUpdates } =
  storeToRefs(useWeeklyUpdatesStore());

const selectedWeeklyUpdate = ref<WeeklyUpdate | null>(null);
const [isReviewWeeklyUpdateModalActive, toggleReviewWeeklyUpdateModal] =
  useToggle();

const onClickReviewWeeklyUpdate = (weeklyUpdate: WeeklyUpdate) => {
  selectedWeeklyUpdate.value = weeklyUpdate;
  toggleReviewWeeklyUpdateModal(true);
};
</script>
