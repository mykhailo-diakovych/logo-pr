<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Update student mentor"
    width="500px"
    :confirm-loading="isUpdatingStudentMentor"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-form-item label="Mentor" v-bind="validateInfos.mentorId">
        <a-select
          v-model:value="formModel.mentorId"
          :options="managersSelectOptions"
          placeholder="Select mentor"
        />
      </a-form-item>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { Rule } from "ant-design-vue/es/form";
import { Form } from "ant-design-vue";
import { storeToRefs } from "pinia";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { useFetchManagers } from "~/composables/managers/useFetchManagers";
import { reactive, useVModel, watch } from "#imports";
import { StudentUpdatePayload } from "~/types/students";
import { useStudentStore } from "~/store/students/useStudentStore";

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

const { managersSelectOptions, fetchManagers } = useFetchManagers();

const studentStore = useStudentStore();
const { isUpdatingStudentMentor } = storeToRefs(studentStore);
const { updateStudentMentor } = studentStore;

const formModel = reactive<StudentUpdatePayload>({
  mentorId: "",
});
const formModelRules = reactive<Record<keyof StudentUpdatePayload, Rule[]>>({
  mentorId: [
    {
      required: true,
      message: "This field is required",
    },
  ],
});
const { validate, validateInfos, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const onSubmit = async () => {
  if (!(await validate())) return;

  try {
    await updateStudentMentor(props.studentId, formModel.mentorId);
    isModalActive.value = false;
  } catch (e) {}
};
watch(isModalActive, (value) => {
  if (!value) return;

  resetFields();
  fetchManagers();
});
</script>
