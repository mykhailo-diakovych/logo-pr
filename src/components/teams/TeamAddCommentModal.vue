<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Add note"
    title-class="normal-case"
    ok-text="Create"
    :confirm-loading="isCreatingNote"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[0, 30]">
        <a-col :span="24">
          <a-form-item label="Title" v-bind="validateInfos.title">
            <a-input
              v-model:value="formModel.title"
              placeholder="Enter title"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Notes" v-bind="validateInfos.note">
            <c-quill-editor
              v-model="formModel.note"
              placeholder="Enter notes"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { Rule } from "ant-design-vue/es/form";
import { Form } from "ant-design-vue";
import { storeToRefs } from "pinia";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import CQuillEditor from "~/components/ui/CQuillEditor.vue";
import { reactive, useVModel, watch } from "#imports";
import { NotePayload } from "~/types/notes";
import { useNotesStore } from "~/store/notes/useNotesStore";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  studentId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
  (e: "update:studentId", id: string): void;
}>();
const isModalActive = useVModel(props, "visible", emit);
const selectedStudentId = useVModel(props, "studentId", emit);

const formModel = reactive<NotePayload>({
  note: "",
  title: "",
});
const formModelRules = reactive<Record<keyof NotePayload, Rule[]>>({
  note: [{ required: true, message: "This field is required" }],
  title: [{ required: true, message: "This field is required" }],
});
const { validate, resetFields, validateInfos } = Form.useForm(
  formModel,
  formModelRules
);

const notesStore = useNotesStore();
const { isCreatingNote } = storeToRefs(notesStore);
const { createNote } = notesStore;

const onSubmit = async () => {
  if (!(await validate())) return;

  await createNote(selectedStudentId.value, formModel);
  isModalActive.value = false;
};
watch(isModalActive, (active) =>
  active ? resetFields() : (selectedStudentId.value = "")
);
</script>
