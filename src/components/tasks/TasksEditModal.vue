<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :title="title"
    :ok-text="submitCaption"
    centered
    :confirm-loading="isLoading"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[24, 30]">
        <a-col :span="12">
          <a-form-item label="Type" v-bind="validateInfos.academyTask">
            <a-select
              v-model:value="formModel.academyTask"
              placeholder="Select type"
              :options="taskTypesOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Occupation" v-bind="validateInfos.occupation">
            <a-select
              v-model:value="formModel.occupation"
              placeholder="Select occupation"
              :options="occupationOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Title" v-bind="validateInfos.title">
            <a-input
              v-model:value="formModel.title"
              placeholder="Enter title"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Description" v-bind="validateInfos.description">
            <a-textarea
              v-model:value="formModel.description"
              placeholder="Enter Description"
              :auto-size="{ minRows: 7, maxRows: 7 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Form } from "ant-design-vue";
import CModalMenu from "~/components/ui/CModalMenu";
import { computed, reactive, useToggle, useVModel, watch } from "#imports";
import { convertEnumToSelectOptions } from "~/helpers/utils";
import { TasksPayload, TasksType } from "~/types/tasks";
import { Occupation } from "~/types/common";
import { useTasksStore } from "~/store/tasks/useTasksStore";
import Tasks from "~/services/tasks";

const props = defineProps({
  selectedTaskId: {
    type: String as PropType<string>,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
  (e: "update:selected-task-id", id: string): void;
}>();
const isModalActive = useVModel(props, "visible", emit);
const selectedTaskId = useVModel(props, "selectedTaskId", emit);
const isEditable = computed(() => !!props.selectedTaskId);
const title = computed(() => (isEditable.value ? "Update task" : "Add task"));
const submitCaption = computed(() => (isEditable.value ? "Save" : "Create"));

const taskTypesOptions = convertEnumToSelectOptions(TasksType);
const occupationOptions = convertEnumToSelectOptions(Occupation);

const formModel = reactive<TasksPayload>({
  academyTask: null,
  occupation: null,
  title: null,
  description: null,
});
const formModelRules = reactive({
  academyTask: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  occupation: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  title: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  description: [
    {
      required: true,
      message: "This field is required",
    },
  ],
});
const { validateInfos, validate, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const [isLoading, toggleLoading] = useToggle();
const { createTask, updateTask } = useTasksStore();
const onSubmit = async () => {
  if (!(await validate())) return;

  toggleLoading(true);
  try {
    isEditable.value
      ? await updateTask(selectedTaskId.value, formModel)
      : await createTask(formModel);

    isModalActive.value = false;
  } finally {
    toggleLoading(false);
  }
};
watch(isModalActive, (active) => {
  if (!active) selectedTaskId.value = "";
  else resetFields();
});
watch([isModalActive, selectedTaskId], async ([active, taskId]) => {
  if (!active || !taskId) return;

  const task = await Tasks.getById(taskId);

  Object.keys(formModel).forEach((key) => {
    formModel[key] = task[key];
  });
});
</script>

<style lang="scss">
.tasks-edit-form {
  &__type {
    .ant-form-vertical & {
      @apply flex-row items-center;
    }
    .ant-form-item-label {
      @apply p-0 #{!important};
    }
  }
}
</style>
