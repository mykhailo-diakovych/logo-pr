<template>
  <span
    class="text-blue leading-4 cursor-pointer whitespace-nowrap"
    @click="onClickDownloadResume"
  >
    {{ resumeFileName }}
  </span>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { LogoFile } from "~/types/common";
import { computed } from "#imports";
import Files from "~/services/files";

const props = defineProps({
  resume: {
    type: Object as PropType<LogoFile | null>,
    default: null,
  },
});

const resumeFileName = computed(() => {
  if (!props.resume) return "-";

  return `
    ${props.resume.fileName.split("_").shift()}.${props.resume.fileName
    .split(".")
    .pop()}`;
});
const onClickDownloadResume = () =>
  props.resume && Files.download(props.resume.id);
</script>
