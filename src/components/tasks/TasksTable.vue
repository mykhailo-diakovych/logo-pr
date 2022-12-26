<template>
  <CTable
    v-model:current="tasksFilters.page"
    :items="computedTasks"
    :columns="tableColumns"
    :total="totalTasks"
    :loading="isLoadingTasks"
    use-expanded-row
    :scroll="{ y: 'calc(100vh - 255px)' }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'academyTask'">
        <c-status :color="tableStatusColors[record.academyTask]">
          {{ record.academyTask }}
        </c-status>
      </template>
    </template>
    <template #column-action="{ item }">
      <a-menu>
        <a-menu-item
          v-for="(action, index) in tableActions"
          :key="index"
          @click="action.handler(item)"
        >
          <component :is="action.icon" v-if="action.icon" />
          {{ action.title }}
        </a-menu-item>
      </a-menu>
    </template>
  </CTable>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ColumnsType } from "ant-design-vue/es/table";
import { Modal } from "ant-design-vue";
import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { navigateTo } from "#app";
import { useTasksStore } from "~/store/tasks/useTasksStore";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { computed, onBeforeMount } from "#imports";
import { Task, TasksType } from "~/types/tasks";
import CTable from "~/components/ui/CTable.vue";
import CStatus from "~/components/ui/CStatus.vue";

const emit = defineEmits<{
  (e: "action:edit", task: Task): void;
}>();

const tasksStore = useTasksStore();
const { tasks, totalTasks, tasksFilters, isLoadingTasks } =
  storeToRefs(tasksStore);
const { fetchTasks, deleteTask } = tasksStore;

onBeforeMount(fetchTasks);

const { occupationConstant } = storeToRefs(useConstantsStore());

const computedTasks = computed(() =>
  tasks.value.map((task) => ({
    ...task,
    occupation: occupationConstant.value?.[task.occupation],
  }))
);

const tableColumns: ColumnsType = [
  {
    title: "Occupation",
    dataIndex: "occupation",
    key: "occupation",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Type",
    dataIndex: "academyTask",
    key: "academyTask",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "35%",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: "5%",
  },
];
const onClickDeleteTask = (task: Task) => {
  Modal.confirm({
    title: `Are you sure you want to delete the task "${task.title}"?`,
    okText: "Yes",
    cancelText: "No",
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    okButtonProps: {
      type: "text",
    },
    width: 671,
    onOk: () => deleteTask(task.id),
  });
};
const tableActions = [
  {
    title: "Edit",
    icon: EditOutlined,
    handler: (task: Task) => emit("action:edit", task),
  },
  { title: "Delete", icon: DeleteOutlined, handler: onClickDeleteTask },
  {
    title: "Review Feedbacks",
    icon: MessageOutlined,
    handler: (task: Task) => navigateTo(`/tasks/${task.id}`),
  },
];
const tableStatusColors: Record<TasksType, string> = {
  [TasksType.Final]: "purple",
  [TasksType.Active]: "orange",
  [TasksType.OnBoarding]: "blue",
  [TasksType.Application]: "green",
};
</script>
