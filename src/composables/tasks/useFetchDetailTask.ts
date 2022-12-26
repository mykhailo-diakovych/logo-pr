import StudentTasksService from "~/services/students/student-tasks.service";
import { ref, useToggle } from "#imports";
import { TaskDetail } from "~/types/tasks";

export const useFetchDetailTask = () => {
  const detailTask = ref<TaskDetail | null>(null);
  const [isFetchingDetailTask, toggleFetchingDetailTask] = useToggle(true);

  const fetchDetailStudentTask = async (studentId: string, taskId: string) => {
    toggleFetchingDetailTask(true);
    try {
      detailTask.value = await StudentTasksService.getDetailed(
        studentId,
        taskId
      );
    } catch (e) {
      detailTask.value = null;
    } finally {
      toggleFetchingDetailTask(false);
    }
  };

  return { detailTask, isFetchingDetailTask, fetchDetailStudentTask };
};
