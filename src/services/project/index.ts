import CrudService from "~/services/crud";
import { Project, ProjectFilters, ProjectPayload } from "~/types/project";

class ProjectService extends CrudService<
  Project,
  ProjectFilters,
  ProjectPayload,
  ProjectPayload
> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getList() {
    const { data: newProjects } = await this.get<Project[]>("list");
    return newProjects;
  }
}

export default new ProjectService("projects");
