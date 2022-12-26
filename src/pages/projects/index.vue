<template>
  <section>
    <header class="flex justify-end mb-5">
      <c-button-action @click="toggleProjectEditModal(true)">
        Add Project
      </c-button-action>
    </header>
    <section>
      <projects-table
        v-model:current="projectsFilters.page"
        :projects="projects"
        :total="totalProjects"
        :loading="isLoadingProjects"
        :scroll="{ y: 'calc(100vh - 255px)' }"
        @action:update-project="onClickEditProject"
      />
    </section>

    <projects-edit-modal
      v-model:visible="isProjectsEditModalActive"
      v-model:selected-project-id="selectedProjectId"
    />
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { definePageMeta, onBeforeMount, ref, useToggle } from "#imports";
import { useProjectsStore } from "~/store/projects/useProjectsStore";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import { Project } from "~/types/project";
import ProjectsTable from "~/components/projects/ProjectsTable.vue";

definePageMeta({
  title: "Projects",
});
const projectsStore = useProjectsStore();
const { projects, totalProjects, projectsFilters, isLoadingProjects } =
  storeToRefs(projectsStore);
const { fetchProjects } = projectsStore;

onBeforeMount(fetchProjects);

const [isProjectsEditModalActive, toggleProjectEditModal] = useToggle();

const selectedProjectId = ref("");
const onClickEditProject = (project: Project) => {
  selectedProjectId.value = project.id;
  toggleProjectEditModal(true);
};
</script>
