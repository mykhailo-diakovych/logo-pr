import Api from "~/services/Api";
import { ServiceGetAll } from "~/types/crud";
import { Task, TaskDetail } from "~/types/tasks";
import { StudentTasksFilters } from "~/types/students";
import { FilterResponse } from "~/types/filters";

class StudentTasksService
  extends Api
  implements ServiceGetAll<StudentTasksFilters, FilterResponse<Task>>
{
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(filters: StudentTasksFilters): Promise<FilterResponse<Task>> {
    const studentId = filters.studentId;
    Reflect.deleteProperty(filters, "studentId");

    const { data: tasks } = await this.get<FilterResponse<Task>>(
      `${studentId}/records`,
      { params: filters }
    );
    return tasks;
  }

  async getDetailed(studentId: string, taskId: string) {
    const { data: task } = await this.get<TaskDetail>(`${taskId}/detailed`, {
      params: { studentId },
    });
    return task;
  }
}

export default new StudentTasksService("academy-tasks");
