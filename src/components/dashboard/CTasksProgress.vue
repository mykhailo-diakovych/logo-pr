<template>
  <div class="flex items-center">
    <div class="flex items-center mr-2.5 text-sm leading-4 font-normal">
      <div class="text-peach">{{ studentSummary.academyTask.approved }}</div>
      <div>/{{ studentSummary.academyTask.total }}</div>
    </div>

    <a-progress
      :percent="percent"
      trail-color="#F5F5F5"
      stroke-color="#F19876"
      :show-info="false"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { StudentSummary } from "~/types/dashboard";
import { computed } from "#imports";

const props = defineProps({
  studentSummary: {
    type: Object as PropType<StudentSummary>,
    required: true,
  },
});

const percent = computed(
  () =>
    (props.studentSummary.academyTask.approved /
      props.studentSummary.academyTask.total) *
    100
);
</script>
