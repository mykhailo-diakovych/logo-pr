import { useAsyncData } from "#app";
import dayjs from "dayjs";
import Tasks from "~/services/tasks";
import { computed } from "#imports";

export const useFetchTaskFeedbacks = async (taskId: string) => {
  const taskFeedbacksView = computed(() =>
    taskFeedbacks.value?.map((taskFeedback) => ({
      ...taskFeedback,
      studentFirstName: `${taskFeedback.studentFirstName} ${taskFeedback.studentLastName}`,
      submittedDate: dayjs(taskFeedback.submittedDate).format("DD MMMM, YYYY"),
    }))
  );
  const {
    data: taskFeedbacks,
    pending: isFetchingTaskFeedbacks,
    refresh: fetchTaskFeedbacks,
  } = await useAsyncData(() => Tasks.getFeedbacksById(taskId), {
    default: () => [],
  });

  return {
    taskFeedbacks,
    taskFeedbacksView,
    isFetchingTaskFeedbacks,
    fetchTaskFeedbacks,
  };
};
