<template>
  <div class="logo-main-layout">
    <a-layout class="h-screen !flex-row">
      <a-layout-sider
        width="180px"
        class="overflow-auto !fixed left-0 top-0 bottom-0 h-screen"
      >
        <CSidebarMenu />
      </a-layout-sider>

      <a-layout class="px-[30px] ml-[180px]">
        <AppHeader
          class="fixed bg-white z-10 w-[calc(100vw-260px)] py-[.8rem]"
        />

        <a-layout-content class="mt-[6rem]">
          <slot />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import CSidebarMenu from "~/components/ui/CSidebarMenu";
import AppHeader from "~/components/general/header/AppHeader.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { onBeforeMount } from "#imports";

const { fetchConstants } = useConstantsStore();
onBeforeMount(fetchConstants);
</script>

<style lang="scss">
.logo-main-layout {
  .ant-layout {
    @apply bg-white;

    &-sider {
      @apply bg-alabaster;
    }
  }
}
</style>
