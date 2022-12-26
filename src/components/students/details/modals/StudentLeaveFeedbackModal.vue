<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :confirm-loading="isSubmittingStudentFeedback"
    :cancel-loading="isCreatingStudentFeedback || isUpdatingStudentFeedback"
    :loading="isFetchingStudentFeedback"
    title="Leave feedback"
    ok-text="Submit"
    cancel-text="Save Draft"
    @ok="onSubmit"
    @cancel="onSaveDraft"
  >
    <a-form layout="vertical">
      <a-row :gutter="[0, 14]">
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.content">
            <c-quill-editor
              v-model="formModel.content"
              placeholder="Your text"
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
import { reactive, useVModel, watch } from "#imports";
import { useFeedbackStore } from "~/store/feedbacks/useFeedbackStore";

const props = defineProps({
  studentId: {
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
}>();
const isModalActive = useVModel(props, "visible", emit);

const formModel = reactive({
  content: "",
});
const formModelRules = reactive<Record<string, Rule[]>>({
  content: [{ required: true, message: "This field is required" }],
});
const { validateInfos, validate, resetFields } = Form.useForm(
  formModel,
  formModelRules
);
const feedbackStore = useFeedbackStore();
const {
  studentFeedback,
  isNeedToUpdateFeedback,
  isCreatingStudentFeedback,
  isFetchingStudentFeedback,
  isUpdatingStudentFeedback,
  isSubmittingStudentFeedback,
} = storeToRefs(feedbackStore);
const {
  createStudentFeedback,
  submitStudentFeedback,
  updateStudentFeedback,
  fetchStudentFeedback,
} = feedbackStore;

const onSaveDraft = async () => {
  if (!(await validate())) return;

  if (studentFeedback.value?.content === formModel.content) return;

  isNeedToUpdateFeedback.value
    ? await updateStudentFeedback(props.studentId, formModel.content)
    : await createStudentFeedback(props.studentId, formModel.content);
  isModalActive.value = false;
};

const onSubmit = async () => {
  if (!(await validate())) return;

  await submitStudentFeedback(props.studentId);
  isModalActive.value = false;
};

watch(studentFeedback, (feedback) => {
  if (!feedback) return;

  formModel.content = feedback.content;
});
watch(isModalActive, (active) => {
  if (!active) return;

  resetFields();
  fetchStudentFeedback(props.studentId);
});
</script>
