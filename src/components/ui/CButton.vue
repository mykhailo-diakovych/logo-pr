<template>
  <a-button v-bind="props" class="w-full c-button">
    <slot />
  </a-button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: { type: String, default: null },
  danger: { type: Boolean, default: false },
  ghost: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
</script>

<style lang="scss">
.c-button {
  &.ant-btn {
    @apply rounded-md h-[50px] text-base leading-6;
  }
}
</style>
