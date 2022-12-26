import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import { useFilters } from "#imports";
import { Project, ProjectFilters, ProjectPayload } from "~/types/project";
import ProjectService from "~/services/project";

export const useProjectsStore = defineStore("Projects", () => {
  const {
    filteredItems: projects,
    filters: projectsFilters,
    loading: isLoadingProjects,
    fetchFilteredItems: fetchProjects,
    totalFilteredItems: totalProjects,
  } = useFilters<Project, ProjectFilters>(ProjectService, {
    page: 0,
  });

  const createProject = async (payload: ProjectPayload) => {
    await ProjectService.create(payload);

    notification.success({
      message: "You successfully create new project",
    });

    await fetchProjects();
  };
  const updateProject = async (id: string, payload: ProjectPayload) => {
    await ProjectService.update(id, payload);

    notification.success({
      message: "You successfully update project",
    });

    await fetchProjects();
  };

  const deleteProject = async (id: string) => {
    try {
      await ProjectService.deleteById(id);

      notification.success({
        message: "You successfully delete project",
      });

      await fetchProjects();
    } catch (e) {
      notification.error({
        message: "Error while deleting project",
      });
    }
  };

  return {
    projects,
    totalProjects,
    projectsFilters,
    isLoadingProjects,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
});
