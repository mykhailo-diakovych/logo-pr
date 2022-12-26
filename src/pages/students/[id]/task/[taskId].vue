<template>
  <section class="c-dashboard-section pb-8 text-violet">
    <header-teleport-left>
      <div
        class="flex items-center text-xl w-fit leading-6 cursor-pointer font-medium text-violet"
      >
        <nuxt-link
          class="gap-x-[40px] flex items-center !text-violet"
          :to="studentDetailsPath"
        >
          <arrow-left-outlined />
          Tasks
        </nuxt-link>
      </div>
    </header-teleport-left>

    <student-details-task class="mb-16" :detail-task="detailTask" />
    <student-details-task-results
      v-if="detailTask?.rate && detailTask?.academyTaskSolution"
      :detail-task="detailTask"
    />

    <footer v-if="detailTask?.academyTaskSolution" class="flex gap-x-4 w-1/3">
      <c-button
        danger
        :disabled="disabledButtons"
        :loading="isUpdatingTaskRejectedStatus"
        @click="updateTaskRejectedStatus(detailTask.academyTaskSolution.id)"
      >
        Reject
      </c-button>
      <c-button
        :disabled="disabledButtons"
        type="primary"
        :loading="isUpdatingTaskAcceptedStatus"
        @click="updateTaskAcceptedStatus(detailTask.academyTaskSolution.id)"
      >
        Approve
      </c-button>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { useRoute } from "#app";
import { computed, onBeforeMount } from "#imports";
import StudentDetailsTask from "~/components/students/details/task/StudentDetailsTask.vue";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import StudentDetailsTaskResults from "~/components/students/details/task/StudentDetailsTaskResults.vue";
import { useFetchDetailTask } from "~/composables/tasks/useFetchDetailTask";
import CButton from "~/components/ui/CButton.vue";
import { useUpdateTaskStatus } from "~/composables/tasks/useUpdateTaskStatus";
import { TaskSolutionType } from "~/types/tasks";

const route = useRoute();
const studentId = computed<string>(() => route.params.id as string);
const taskId = computed<string>(() => route.params.taskId as string);

const studentDetailsPath = computed(() => `/students/${studentId.value}`);

const { detailTask, fetchDetailStudentTask } = useFetchDetailTask();
onBeforeMount(() => fetchDetailStudentTask(studentId.value, taskId.value));

const disabledButtons = computed<boolean>(() => {
  const status = detailTask?.value?.academyTaskSolution?.solutionStatus;
  if (status) {
    return (
      TaskSolutionType.Approved === status ||
      TaskSolutionType.Rejected === status
    );
  }
  return false;
});

const handlersAfterUpdateStatus = [
  () => fetchDetailStudentTask(studentId.value, taskId.value),
];
const {
  updateTaskStatus: updateTaskAcceptedStatus,
  isUpdatingTaskStatus: isUpdatingTaskAcceptedStatus,
} = useUpdateTaskStatus(TaskSolutionType.Approved, handlersAfterUpdateStatus);
const {
  updateTaskStatus: updateTaskRejectedStatus,
  isUpdatingTaskStatus: isUpdatingTaskRejectedStatus,
} = useUpdateTaskStatus(TaskSolutionType.Rejected, handlersAfterUpdateStatus);
</script>
