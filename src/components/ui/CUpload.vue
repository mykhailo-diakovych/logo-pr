<template>
  <a-upload
    :show-upload-list="true"
    :file-list="computedSelectedFile"
    :before-upload="beforeUpload"
    @remove="handleRemove"
  >
    <slot />
  </a-upload>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { UploadProps } from "ant-design-vue";
import { computed, useVModel } from "#imports";
import { LogoFile } from "~/types/common";

const props = defineProps({
  modelValue: {
    type: Object as PropType<File | LogoFile | null>,
    default: null,
  },
  uploadHandler: {
    type: Function as PropType<(file: File) => boolean | Promise<boolean>>,
    default: undefined,
  },
});
const emit = defineEmits<{
  (e: "update:modelValue", files: File[]): void;
  (e: "remove"): void;
}>();
const selectedFile = useVModel(props, "modelValue", emit);

const computedSelectedFile = computed(() =>
  selectedFile.value ? [selectedFile.value] : []
);

const handleRemove = () => {
  selectedFile.value = null;
  emit("remove");
};

const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (!(props.uploadHandler && props.uploadHandler(file))) return false;

  selectedFile.value = file;
  return false;
};
</script>

<style lang="scss">
.ant-upload {
  @apply shrink-0;
  &-list {
    @apply w-full border border-[#261D3F] ml-[2.5rem] pb-[3px];
    &:has(div) {
      @apply pb-[8px];
    }
  }
}
</style>
