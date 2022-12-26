<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Accept Application"
    :confirm-loading="isAcceptingStudent"
    ok-text="Submit"
    @ok="onSubmit"
  >
    <p class="text-center text-violet text-xl font-light">
      Accept {{ student.firstName }} {{ student.lastName }} as a student of
      Logo.
    </p>
    <a-form layout="vertical">
      <a-row :gutter="[0, 14]">
        <a-col :span="24">
          <a-form-item label="Mentor" v-bind="validateInfos.mentorId">
            <a-select
              v-model:value="formModel.mentorId"
              placeholder="Select mentor"
              :options="managersSelectOptions"
            />
          </a-form-item>
        </a-col>
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
import { Student, StudentApplicationAcceptPayload } from "~/types/students";
import { useStudentsStore } from "~/store/students/useStudentsStore";
import { useFetchManagers } from "~/composables/managers/useFetchManagers";

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

const formModel = reactive<StudentApplicationAcceptPayload>({
  mentorId: "",
  statusComment: "",
  emailContent: "",
});

const formModelRules = reactive<
  Record<keyof StudentApplicationAcceptPayload, Rule[]>
>({
  mentorId: [{ required: true, message: "This field is required" }],
  statusComment: [{ required: true, message: "This field is required" }],
  emailContent: [{ required: true, message: "This field is required" }],
});

const { managersSelectOptions, fetchManagers } = useFetchManagers();
const [isAcceptingStudent, toggleAcceptingStudent] = useToggle();

const { validateInfos, validate, resetFields } = Form.useForm(
  formModel,
  formModelRules
);
const { applicationAcceptStudent } = useStudentsStore();
const onSubmit = async () => {
  if (!(await validate())) return;

  toggleAcceptingStudent(true);
  try {
    await applicationAcceptStudent(props.student.id, formModel);
    isModalActive.value = false;
  } finally {
    toggleAcceptingStudent(false);
  }
};
watch(isModalActive, (active) => {
  if (!active) return;

  resetFields();
  fetchManagers();
});
</script>
