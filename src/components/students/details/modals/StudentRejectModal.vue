<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :confirm-loading="isRejectingStudent"
    title="Reject Student"
    ok-text="Send"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[0, 14]">
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.emailContent">
            <a-textarea
              v-model:value="formModel.emailContent"
              placeholder="Email message"
              :auto-size="{ minRows: 7, maxRows: 7 }"
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
import { PropType } from "vue";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { reactive, useToggle, useVModel, watch } from "#imports";
import { Student, StudentApplicationRejectPayload } from "~/types/students";
import { useStudentsStore } from "~/store/students/useStudentsStore";

const props = defineProps({
  student: {
    type: Object as PropType<Student>,
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

const formModel = reactive<StudentApplicationRejectPayload>({
  statusComment: "",
  emailContent: "",
});
const formModelRules = reactive<
  Record<keyof StudentApplicationRejectPayload, Rule[]>
>({
  statusComment: [{ required: true, message: "This field is required" }],
  emailContent: [{ required: true, message: "This field is required" }],
});
const { validateInfos, validate, resetFields } = Form.useForm(
  formModel,
  formModelRules
);
const { applicationRejectStudent } = useStudentsStore();
const [isRejectingStudent, toggleRejectingStudent] = useToggle();

const onSubmit = async () => {
  if (!(await validate())) return;

  toggleRejectingStudent(true);

  try {
    applicationRejectStudent(props.student.id, formModel);
    isModalActive.value = false;
  } finally {
    toggleRejectingStudent(false);
  }
};
watch(isModalActive, (active) => active && resetFields());
</script>
