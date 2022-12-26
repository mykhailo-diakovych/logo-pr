import { computed, ref } from "#imports";
import { Project } from "~/types/project";
import ProjectService from "~/services/project";

export const useFetchListProjects = () => {
  const newProjects = ref<Project[]>([]);
  const projectsSelectOptions = computed(() => {
    return newProjects.value.map((project) => ({
      label: project.title,
      value: project.id,
    }));
  });

  const fetchNewProjects = async () => {
    try {
      newProjects.value = await ProjectService.getList();
    } catch (e) {
      newProjects.value.length = 0;
    }
  };

  return { newProjects, projectsSelectOptions, fetchNewProjects };
};
