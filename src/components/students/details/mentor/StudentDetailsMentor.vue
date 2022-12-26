<template>
  <div
    class="rounded-md bg-alabaster inline-flex items-center py-[7px] gap-x-5 leading-[16px] px-3.5 cursor-pointer"
  >
    <span>{{ name }}</span>
    <edit-outlined />
  </div>
</template>

<script lang="ts" setup>
import { EditOutlined } from "@ant-design/icons-vue";

defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>
