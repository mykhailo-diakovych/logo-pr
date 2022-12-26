<template>
  <div class="flex flex-col">
    <span class="text-gray-900 text-xs">{{ title }}</span>
    <span class="text-violet overflow-x-hidden text-ellipsis">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: "",
  },
});
</script>
