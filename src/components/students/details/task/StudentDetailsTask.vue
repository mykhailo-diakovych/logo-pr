<template>
  <div class="flex flex-col">
    <div
      class="mb-3 flex px-5 py-[18px] border border-gallery rounded-md w-fit"
    >
      <c-status :color="taskStatusColor">
        {{ detailTask?.academyTask }}
      </c-status>

      <div
        v-if="detailTask?.academyTaskSolution?.solutionStatus"
        class="flex flex-col ml-[62px]"
      >
        <span class="text-xs leading-[14px] font-normal text-gray-900 mb-1">
          Status
        </span>
        <span
          class="text-sm font-semibold leading-4 capitalize"
          :class="
            taskSolutionStatusColor[
              detailTask?.academyTaskSolution?.solutionStatus
            ]
          "
        >
          {{ detailTask?.academyTaskSolution?.solutionStatus.toLowerCase() }}
        </span>
      </div>

      <div
        v-if="detailTask?.academyTaskSolution?.solutionStatusAppliedAt"
        class="flex flex-col ml-[62px]"
      >
        <span class="text-xs leading-[14px] font-normal text-gray-900 mb-1">
          Updated
        </span>
        <span class="text-sm font-semibold leading-4">
          {{
            formatDate(detailTask?.academyTaskSolution?.solutionStatusAppliedAt)
          }}
        </span>
      </div>
    </div>

    <h1 class="text-2xl font-semibold mb-2.5">
      {{ detailTask?.title || "-" }}
    </h1>

    <p class="mb-[30px]">
      {{ detailTask?.description || "-" }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { tableStatusColors } from "~/constants/tasks";
import { computed } from "#imports";
import CStatus from "~/components/ui/CStatus.vue";
import { TaskDetail, TaskSolutionType } from "~/types/tasks";
import { formatDate } from "~/helpers/date";

const props = defineProps({
  detailTask: {
    type: Object as PropType<TaskDetail | null>,
    default: null,
  },
});

const taskStatusColor = computed(() =>
  props.detailTask ? tableStatusColors[props.detailTask.academyTask] : "Draft"
);

const taskSolutionStatusColor: Readonly<Record<TaskSolutionType, string>> = {
  [TaskSolutionType.Open]: "text-peach",
  [TaskSolutionType.Approved]: "text-green",
  [TaskSolutionType.Rejected]: "text-red",
  [TaskSolutionType.Submitted]: "text-yellow",
};
</script>
