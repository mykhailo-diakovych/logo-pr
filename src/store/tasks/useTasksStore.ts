import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import { useFilters } from "#imports";
import Tasks from "~/services/tasks";
import { Task, TasksFilters, TasksPayload } from "~/types/tasks";

export const useTasksStore = defineStore("Tasks", () => {
  const {
    filteredItems: tasks,
    filters: tasksFilters,
    loading: isLoadingTasks,
    totalFilteredItems: totalTasks,
    fetchFilteredItems: fetchTasks,
  } = useFilters<Task, TasksFilters>(Tasks, {
    page: 0,
  });

  const createTask = async (payload: TasksPayload) => {
    await Tasks.create(payload);

    notification.success({
      message: "You successfully create new task",
    });

    await fetchTasks();
  };
  const updateTask = async (id: string, payload: TasksPayload) => {
    await Tasks.update(id, payload);

    notification.success({
      message: "You successfully update task",
    });

    await fetchTasks();
  };
  const deleteTask = async (id: string) => {
    await Tasks.deleteById(id);

    notification.success({
      message: "You successfully delete task",
    });

    await fetchTasks();
  };

  const resetFilters = () => {
    tasksFilters.academyTasks = [];
    tasksFilters.occupations = [];
  };

  return {
    tasks,
    totalTasks,
    tasksFilters,
    isLoadingTasks,
    resetFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
