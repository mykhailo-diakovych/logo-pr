<template>
  <c-table :columns="tableColumns" :items="computedActivityLogs">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'review'">
        <span
          class="text-blue cursor-pointer"
          @click="onClickReviewActivity(record)"
        >
          Review
        </span>
      </template>
    </template>
  </c-table>
  <student-review-activity-modal
    v-model:visible="isReviewActivityModalActive"
    :text="selectedActivity"
  />
</template>

<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import CTable from "~/components/ui/CTable.vue";
import { useActivityLogsStore } from "~/store/activity-logs/useActivityLogsStore";
import { computed, ref, useToggle } from "#imports";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { ToString } from "~/types/common";
import { ActivityLog } from "~/types/activity-logs";
import StudentReviewActivityModal from "~/components/students/details/modals/review/StudentReviewActivityModal.vue";

const tableColumns: ColumnsType = [
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    width: "6.813rem",
  },
  {
    title: "Status",
    dataIndex: "screeningStatus",
    key: "screeningStatus",
    width: "6.875rem",
  },
  {
    title: "Admin",
    dataIndex: "authorFirstName",
    key: "authorFirstName",
    width: "9.385rem",
  },
  { title: "Email", dataIndex: "review", key: "review", width: "7.875rem" },
  {
    title: "Comment",
    dataIndex: "statusComment",
    key: "statusComment",
    width: "44.063rem",
  },
];

const { activityLogs } = storeToRefs(useActivityLogsStore());
const { screeningStatusConstant } = storeToRefs(useConstantsStore());

const computedActivityLogs = computed<ToString<ActivityLog>[]>(() =>
  activityLogs.value.map((activityLog) => ({
    ...activityLog,
    createdAt: dayjs(activityLog.createdAt).format("DDMMMYYYY"),
    authorFirstName: [
      activityLog.authorFirstName,
      activityLog.authorLastName,
    ].join(" "),
    screeningStatus:
      screeningStatusConstant.value?.[activityLog.screeningStatus] || "",
  }))
);

const selectedActivity = ref("");
const [isReviewActivityModalActive, toggleReviewActivityModal] = useToggle();
const onClickReviewActivity = (activity: ActivityLog) => {
  selectedActivity.value = activity.emailContent;
  toggleReviewActivityModal(true);
};
</script>
