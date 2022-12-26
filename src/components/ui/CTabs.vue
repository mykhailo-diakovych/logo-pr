<template>
  <a-tabs v-model="activeKey" class="c-tabs">
    <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.title">
      <component
        :is="tab.content.component"
        v-if="tab.content?.component"
        :option="tab.content?.option"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps({ tabs: { type: Array, default: () => [] } });
const activeKey = ref(1);
</script>

<style lang="scss">
.c-tabs {
  .ant-tabs {
    &-nav {
      @apply mb-[30px] before:border-b-alabaster;
    }

    &-tab {
      @apply py-3 text-sm leading-[22px] font-semibold text-blue;

      &-btn {
        @apply text-blue;
      }

      &-active .ant-tabs-tab-btn {
        @apply text-blue;
        text-shadow: none;
      }
    }

    &-ink-bar {
      background: none;
      @apply bg-blue;
    }
  }
}
</style>
