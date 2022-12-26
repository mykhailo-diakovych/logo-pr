<template>
  <section>
    <h1 class="text-2xl font-semibold mb-4">Results</h1>

    <div class="mb-5">
      <h5 class="mb-2">Describe your work on this assignment.</h5>
      <p class="font-light">
        {{ detailTask?.academyTaskSolution.solution }}
      </p>
    </div>
    <div class="mb-[22px]">
      <h5 class="mb-4">How was your editing experience?</h5>
      <c-smile-rate :model-value="detailTask?.rate.rateValue" disabled />
    </div>
    <div class="mb-5">
      <h5 class="mb-2">
        Thanks! What did you like about it? What could be improved? (optional)
      </h5>
      <p class="font-light">
        {{ detailTask?.rate.feedback }}
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { TaskDetail } from "~/types/tasks";
import CSmileRate from "~/components/ui/CSmileRate.vue";

defineProps({
  detailTask: {
    type: Object as PropType<TaskDetail | null>,
    default: null,
  },
});
</script>
