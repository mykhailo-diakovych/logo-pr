<template>
  <a-button class="c-button-action">
    <template v-if="icon" #icon>
      <PlusOutlined :style="`color:#3E80FA`" />
    </template>

    <slot />
  </a-button>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.c-button-action {
  @apply border-blue text-blue flex items-center justify-center px-4 py-0.5 rounded-[6px] h-7;

  span:first-of-type {
    @apply text-sm leading-[22px] h-3.5 w-3.5 flex items-center justify-center;
  }
}
</style>
