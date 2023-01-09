import Tasks from "~/services/tasks";
import { computed, ref, useToggle } from "#imports";
import { Task } from "~/types/tasks";

export const useFetchStudentAvailableTasks = () => {
  const studentAvailableTasks = ref<Task[]>([]);
  const studentAvailableTasksSelectOptions = computed(() =>
    studentAvailableTasks.value.map((task) => {
      return {
        label: task.occupation
          ? `${task.occupation}: ${task.title}`
          : task.title,
        value: task.id,
      };
    })
  );
  const [isFetchingAvailableTasks, toggleFetchingAvailableTasks] = useToggle();

  const fetchStudentAvailableTasks = async (studentId: string) => {
    toggleFetchingAvailableTasks(true);
    try {
      studentAvailableTasks.value = await Tasks.getStudentAvailableTasks(
        studentId
      );
    } catch (e) {
      studentAvailableTasks.value.length = 0;
    } finally {
      toggleFetchingAvailableTasks(false);
    }
  };

  return {
    fetchStudentAvailableTasks,
    isFetchingAvailableTasks,
    studentAvailableTasksSelectOptions,
  };
};
