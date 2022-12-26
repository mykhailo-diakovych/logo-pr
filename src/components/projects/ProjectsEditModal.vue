<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :title="title"
    :ok-text="submitCaption"
    centered
    class="projects-edit-modal"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[0, 20]">
        <a-col :span="24">
          <a-form-item class="mb-5" label="Title" v-bind="validateInfos.title">
            <a-input
              v-model:value="formModel.title"
              placeholder="Enter Title"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            class="mb-5"
            label="Status"
            v-bind="validateInfos.projectStatus"
          >
            <a-select
              v-model:value="formModel.projectStatus"
              placeholder="Select status"
              :options="projectStatusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Description" v-bind="validateInfos.description">
            <c-quill-editor
              v-model="formModel.description"
              :placeholder="'Enter comment'"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script setup lang="ts">
import { Form } from "ant-design-vue";
import { storeToRefs } from "pinia";
import CModalMenu from "~/components/ui/CModalMenu";
import { computed, reactive, useVModel, watch } from "#imports";
import { ProjectPayload } from "~/types/project";
import { useProjectsStore } from "~/store/projects/useProjectsStore";
import CQuillEditor from "~/components/ui/CQuillEditor.vue";
import { convertConstantsToSelectOptions } from "~/helpers/utils";
import ProjectService from "~/services/project";
import { ToString } from "~/types/common";
import { useConstantsStore } from "~/store/constants/useConstantsStore";

const props = defineProps({
  selectedProjectId: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
  (e: "update:selected-project-id", id: string): void;
}>();
const isModalActive = useVModel(props, "visible", emit);

const isEditable = computed(() => !!props.selectedProjectId);
const title = computed(() =>
  isEditable.value ? "Update Project" : "Add Project"
);
const submitCaption = computed(() => (isEditable.value ? "Save" : "Create"));

const { projectStatusConstant } = storeToRefs(useConstantsStore());
const projectStatusOptions = computed(() =>
  convertConstantsToSelectOptions(projectStatusConstant.value)
);

const formModel = reactive<ToString<ProjectPayload>>({
  title: "",
  description: "",
  projectStatus: null,
});

const formRules = reactive({
  title: [
    {
      required: true,
      message: "This field is required.",
    },
  ],
  projectStatus: [
    {
      required: true,
      message: "This field is required.",
    },
  ],
  description: [
    {
      required: true,
      message: "This field is required.",
    },
  ],
});
const { validate, validateInfos, resetFields } = Form.useForm(
  formModel,
  formRules
);

watch(isModalActive, (active) => {
  if (!active) emit("update:selected-project-id", "");
  else resetFields();
});
watch(
  [isModalActive, () => props.selectedProjectId],
  async ([active, projectId]) => {
    if (!active || !projectId) return;

    const project = await ProjectService.getById(projectId);

    const formModelKeys = Object.keys(formModel) as (keyof ProjectPayload)[];
    formModelKeys.forEach((key) => {
      formModel[key] = project[key];
    });
  }
);
const { createProject, updateProject } = useProjectsStore();

const onSubmit = async () => {
  if (!(await validate())) return;

  isEditable.value
    ? updateProject(props.selectedProjectId, formModel as ProjectPayload)
    : createProject(formModel as ProjectPayload);

  isModalActive.value = false;
};
</script>

<style lang="scss">
.projects-edit-modal {
  .ant-form-item-has-error {
    .c-quill-editor {
      @apply border-red;
    }
  }
}
</style>
