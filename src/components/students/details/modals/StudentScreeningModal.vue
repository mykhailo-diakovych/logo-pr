<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Screening Status"
    :confirm-loading="isStartScreening"
    ok-text="Send"
    title-class="!mb-5 "
    class="student-screening-modal"
    @ok="onSubmit"
  >
    <p class="text-center text-xl font-light text-violet">
      Start a screening process for the {{ studentName }}
      {{ studentLastName }}
    </p>
    <a-form layout="vertical">
      <a-row :gutter="[0, 14]">
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.emailContent">
            <a-select
              v-model:value="formModel.screeningStatus"
              placeholder="Select application status"
              :options="screeningStatusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="isSelectedTestTaskProvided" :span="24">
          <a-form-item label="Select task">
            <a-select
              v-model:value="formModel.academyTaskId"
              placeholder="Select application status"
              :options="studentAvailableTasksSelectOptions"
              :loading="isFetchingAvailableTasks"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.emailContent">
            <c-quill-editor
              v-model="formModel.emailContent"
              placeholder="Email message"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.statusComment">
            <a-input
              v-model:value="formModel.statusComment"
              placeholder="Status comment"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script setup lang="ts">
import { Rule } from "ant-design-vue/es/form";
import { Form } from "ant-design-vue";
import { storeToRefs } from "pinia";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import CQuillEditor from "~/components/ui/CQuillEditor.vue";
import { computed, reactive, useToggle, useVModel, watch } from "#imports";
import { StudentApplicationScreeningPayload } from "~/types/students";
import { useStudentsStore } from "~/store/students/useStudentsStore";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { ApplicationStatus, ToString } from "~/types/common";
import { useFetchStudentAvailableTasks } from "~/composables/students/useFetchStudentAvailableTasks";

const props = defineProps({
  studentId: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  studentName: {
    type: String,
    default: "",
  },
  studentLastName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
}>();
const isModalActive = useVModel(props, "visible", emit);

const formModel = reactive<ToString<StudentApplicationScreeningPayload>>({
  emailContent: "",
  statusComment: "",
  screeningStatus: "",
  academyTaskId: "",
});
const formModelRules = reactive<
  Record<
    keyof Omit<StudentApplicationScreeningPayload, "academyTaskId">,
    Rule[]
  >
>({
  emailContent: [{ required: true, message: "This field is required" }],
  statusComment: [{ required: true, message: "This field is required" }],
  screeningStatus: [{ required: true, message: "This field is required" }],
});
const { validate, validateInfos, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const { applicationStartScreening } = useStudentsStore();
const [isStartScreening, toggleStartScreening] = useToggle();
const onSubmit = async () => {
  if (!(await validate())) return;

  toggleStartScreening(true);
  try {
    await applicationStartScreening(
      props.studentId,
      formModel as StudentApplicationScreeningPayload
    );
    isModalActive.value = false;
  } finally {
    toggleStartScreening(false);
  }
};
watch(isModalActive, (active) => {
  if (!active) return;

  resetFields();
});

watch(
  () => formModel.emailContent,
  (val) => {
    if (val === "<p><br></p>") {
      formModel.emailContent = "";
    }
  }
);

const { screeningStatusConstant } = storeToRefs(useConstantsStore());
const screeningStatusOptions = computed(() => {
  if (!screeningStatusConstant.value) return [];

  return Object.entries(screeningStatusConstant.value).map(
    ([value, label]) => ({ label, value })
  );
});
const isSelectedTestTaskProvided = computed(
  () => formModel.screeningStatus === ApplicationStatus.TestTask
);
const {
  studentAvailableTasksSelectOptions,
  isFetchingAvailableTasks,
  fetchStudentAvailableTasks,
} = useFetchStudentAvailableTasks();
watch(
  isSelectedTestTaskProvided,
  (flag) => flag && fetchStudentAvailableTasks(props.studentId)
);
</script>

<style lang="scss">
.student-screening-modal {
  .ant-form-item {
    &.ant-form-item-has-error {
      cursor: pointer;

      .c-quill-editor {
        border-color: #f74545;
      }
    }
  }
}
</style>
