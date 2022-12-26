<template>
  <div class="c-dashboard-card min-h-[350px] rounded-md border border-gallery">
    <div class="flex items-center rounded-md bg-gallery px-6 py-2">
      <client-only>
        <nuxt-icon v-if="icon" :name="icon" class="mr-3.5 w-4" />
      </client-only>
      <h3
        v-if="title"
        class="text-lg leading-[22px] font-medium text-violet m-0"
      >
        {{ title }}
      </h3>
    </div>

    <div class="p-5 flex justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
}

defineProps<Props>();
</script>
