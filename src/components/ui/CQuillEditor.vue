<template>
  <div
    class="c-quill-editor flex flex-col border border-solid border-alto rounded-md p-1.5 h-[300px] overflow-auto"
  >
    <quill-editor
      ref="quillEditorRef"
      v-model:content="content"
      :placeholder="placeholder"
      content-type="html"
      theme="snow"
      :toolbar="editorToolbarOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { readonly, ref, useVModel, watch } from "#imports";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});
const emit = defineEmits<{
  (e: "update:modelValue", content: string);
}>();
const content = useVModel(props, "modelValue", emit);
const quillEditorRef = ref<{ setHTML: (value: string) => void } | null>(null);

let newContent = "";
watch(content, (newValue) => {
  newContent = newValue;
});

watch(content, (newValue) => {
  if (newContent === newValue) return;
  quillEditorRef.value.setHTML(newValue);

  // move cursor to end
  nextTick(() => {
    const q = quillEditorRef.value.getQuill();
    q.setSelection(newValue.length, 0, "api");
    q.focus();
  });
});

const editorToolbarOptions = readonly([
  "italic",
  "bold",
  "underline",
  "strike",
  "link",
  { color: [] },
  { align: [] },
  { list: "bullet" },
]);
</script>

<style lang="scss">
.c-quill-editor {
  .ql-toolbar {
    border: none !important;
    width: calc(100% - 0.5rem);
    @apply absolute z-50 bottom-1 left-1 bg-gallery rounded-lg;

    .ql-formats {
      width: 100%;
      display: flex !important;
      justify-content: space-around;
    }
  }
  .ql-editor {
    padding-left: 6px !important;
    padding-right: 6px !important;

    p {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5rem;
    }
  }
  .ql-container {
    height: calc(100% - 2.5rem);
    border: none !important;
  }
  .ql-blank {
    &::before {
      color: #d3d3d3 !important;
      font-style: initial !important;
      font-size: 1rem;
      font-weight: 400;
      left: 6px !important;
      font-family: "Roboto", sans-serif !important;
    }
  }
}
</style>
