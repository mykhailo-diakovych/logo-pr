<template>
  <CTable
    :items="projects"
    :columns="tableColumns"
    :total="total"
    use-expanded-row
    class="projects-table"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'projectStatus'">
        {{ projectStatusConstant?.[record[column.key]] }}
      </template>
    </template>
    <template #column-action="{ item }">
      <a-menu>
        <a-menu-item @click="onClickEditProject(item)">
          <edit-outlined />
          Edit
        </a-menu-item>

        <a-menu-item @click="onClickDeleteProject(item)">
          <delete-outlined />
          Delete
        </a-menu-item>
      </a-menu>
    </template>
  </CTable>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Modal } from "ant-design-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import { Project, ProjectStatus } from "~/types/project";
import { useProjectsStore } from "~/store/projects/useProjectsStore";
import CTable from "~/components/ui/CTable.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";

defineProps({
  projects: {
    type: Array as PropType<Project[]>,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (e: "action:update-project", project: Project): void;
}>();

const { projectStatusConstant } = storeToRefs(useConstantsStore());

const tableColumns: ColumnsType = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    width: "300px",
  },
  {
    title: "Status",
    dataIndex: "projectStatus",
    key: "projectStatus",
    width: "180px",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "50%",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: "100px",
  },
];

const { deleteProject } = useProjectsStore();

const onClickEditProject = (project: Project) =>
  emit("action:update-project", project);

const onClickDeleteProject = (project: Project) => {
  if (project.projectStatus === ProjectStatus.InProgress) {
    Modal.confirm({
      title: `The project "${project.title}" cannot be deleted because it's currently in use`,
      okText: "Okay",
      centered: true,
      wrapClassName: "c-modal-remove c-modal-remove_warning",
      width: 671,
    });
    return;
  }

  Modal.confirm({
    title: `Are you sure you want to delete the project "${project.title}"?`,
    okText: "Yes",
    cancelText: "No",
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    okButtonProps: {
      type: "text",
    },
    width: 671,
    onOk: () => deleteProject(project.id),
  });
};
</script>

<style lang="scss">
.projects-table.c-table {
  .c-table__column--description {
    p {
      @apply opacity-0 first-of-type:opacity-100 transition-all duration-500;
    }

    &.expand p {
      @apply opacity-100;
    }
  }
}
</style>
