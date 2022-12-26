import { awaitExpression } from "@babel/types";
import CrudService from "~/services/crud";
import { Task, TaskFeedback, TasksFilters, TaskSummary } from "~/types/tasks";

class TasksService extends CrudService<Task, TasksFilters> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getStudentAvailableTasks(studentId: string) {
    const { data: tasks } = await this.get<Task[]>(`titles`, {
      params: { studentId },
    });
    return tasks;
  }

  async getFeedbacksById(taskId: string) {
    try {
      const { data: feedbacks } = await this.get<TaskFeedback[]>(
        `${taskId}/feedbacks`
      );
      return feedbacks;
    } catch (e) {
      console.log(e);
    }
  }

  async getSummary(studentId: string) {
    const { data: tasksSummary } = await this.get<TaskSummary>("summary", {
      params: { studentId },
    });
    return tasksSummary;
  }
}

export default new TasksService("academy-tasks");
