<template>
  <div class="dashboard-table">
    <CTable
      v-model:current="currentPage"
      :items="mentorDashboardInfo"
      :actions="tableActions"
      :columns="columns"
      :scroll="{ y: 'calc(100vh - 200px)' }"
      :loading="isLoading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'firstName'">
          <nuxt-link
            :to="`/students/${record.id}`"
            class="text-sm font-normal leading-4 underline text-blue hover:text-blue hover:underline"
          >
            {{ record.firstName }}
          </nuxt-link>
        </template>

        <template v-if="column.key === 'weeklyUpdates'">
          <div class="flex items-center gap-x-4">
            <span>Progress</span>
            <weekly-update-calendar
              class="w-full"
              :weekly-updates="record.weeklyUpdates"
            />
          </div>
        </template>

        <template v-if="column.key === 'academyTask'">
          <CTasksProgress :student-summary="record" />
        </template>
      </template>
    </CTable>

    <student-leave-feedback-modal
      v-model:visible="isLeaveFeedbackModalActive"
      :student-id="selectedStudentId"
    />
  </div>
</template>

<script setup lang="ts">
import { MessageOutlined } from "@ant-design/icons-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import CTable from "~/components/ui/CTable.vue";
import CTasksProgress from "~/components/dashboard/CTasksProgress.vue";
import { useFetchMentorDashboard } from "~/composables/dashboard/useFetchMentorDashboard";
import { ref, useToggle } from "#imports";
import StudentLeaveFeedbackModal from "~/components/students/details/modals/StudentLeaveFeedbackModal.vue";
import { TableActions } from "~/types/table";
import { StudentSummary } from "~/types/dashboard";

const { mentorDashboardInfo, isLoading } = useFetchMentorDashboard();

const currentPage = ref<number>(0);

const selectedStudentId = ref("");
const [isLeaveFeedbackModalActive, toggleLeaveFeedbackModal] = useToggle();

const tableActions = computed<TableActions<StudentSummary>>(() => [
  {
    title: "Submit Feeback",
    icon: MessageOutlined,
    handler: (student) => {
      selectedStudentId.value = student.id;
      toggleLeaveFeedbackModal(true);
    },
  },
]);

const columns: ColumnsType = [
  {
    title: "Students",
    dataIndex: "firstName",
    key: "firstName",
    className: "align-middle",
    width: 195,
  },
  {
    title: "Weekly updates",
    dataIndex: "weeklyUpdates",
    key: "weeklyUpdates",
  },
  {
    title: "Tasks",
    dataIndex: "academyTask",
    key: "academyTask",
    width: 170,
    className: "center",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: 55,
  },
];
</script>

<style lang="scss">
.dashboard-table {
  .ant {
    &-table {
      &-tbody {
        .ant-table-row {
          @apply h-[86px];
        }
        .ant-table-cell {
          @apply border-r;
        }
      }
    }

    &-select {
      &:not(.ant-select-customize-input) {
        .ant-select-selector {
          @apply rounded-md w-[96px];
        }

        .ant-select-selection-search-input {
          @apply text-xs leading-[22px] font-normal text-violet;
        }
      }

      &-selection-item {
        @apply text-xs leading-[22px] font-normal text-violet;
      }
    }
  }
}
</style>
