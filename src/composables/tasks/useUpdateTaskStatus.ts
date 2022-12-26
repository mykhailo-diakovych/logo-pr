import { notification } from "ant-design-vue";
import { useToggle } from "#imports";
import { TaskSolutionType } from "~/types/tasks";
import AcademyTaskSolutions from "~/services/academy-task-solutions";

export const useUpdateTaskStatus = (
  status: TaskSolutionType,
  handlers: Function[] = []
) => {
  const [isUpdatingTaskStatus, toggleUpdatingTaskStatus] = useToggle();

  const updateTaskStatus = async (id: string) => {
    toggleUpdatingTaskStatus(true);
    try {
      await AcademyTaskSolutions.updateStatus(id, status);

      for (const handler of handlers) {
        await handler();
      }

      notification.success({
        message: `You successfully updated academy task solution status to ${status}`,
      });
    } finally {
      toggleUpdatingTaskStatus(false);
    }
  };

  return { isUpdatingTaskStatus, updateTaskStatus };
};
