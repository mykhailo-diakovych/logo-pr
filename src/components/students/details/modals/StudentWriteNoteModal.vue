<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Add Note"
    ok-text="Submit"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[0, 14]">
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.note">
            <c-quill-editor v-model="formModel.note" placeholder="Your text" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script setup lang="ts">
import { Form } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import CQuillEditor from "~/components/ui/CQuillEditor.vue";
import { reactive, useVModel, watch } from "#imports";
import { NotePayload } from "~/types/notes";
import { useNotesStore } from "~/store/notes/useNotesStore";

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

const formModel = reactive<NotePayload>({
  note: "",
  title: "",
});
const formModelRules = reactive<Record<keyof NotePayload, Rule[]>>({
  note: [
    {
      required: true,
      message: "This field is required.",
    },
  ],
  title: [],
});
const { validate, validateInfos, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const { createNote } = useNotesStore();

const onSubmit = async () => {
  await createNote(props.studentId, formModel);
  isModalActive.value = false;
};
watch(isModalActive, (value) => value && resetFields());
</script>
