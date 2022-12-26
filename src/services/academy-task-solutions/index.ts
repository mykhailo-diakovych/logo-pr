import Api from "~/services/Api";
import { TaskSolutionType } from "~/types/tasks";

class AcademyTaskSolutionsService extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async updateStatus(id: string, status: TaskSolutionType) {
    await this.put(`${id}/status`, { solutionStatus: status });
  }
}

export default new AcademyTaskSolutionsService("academy-task-solutions");
