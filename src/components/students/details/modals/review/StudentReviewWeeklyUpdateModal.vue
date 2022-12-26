<template>
  <c-modal-menu title="Weekly update" :footer="null" width="580px">
    <ul class="flex flex-col gap-y-8">
      <li>
        <h4 class="mb-2 font-normal">
          What you’ve accomplished (did/learned) during this week?
        </h4>
        <p class="font-light">
          {{ weeklyUpdate.achievement }}
        </p>
      </li>
      <li>
        <h4 class="mb-2 font-normal">
          What are your top 1-3 goals for the next week?
        </h4>
        <ul class="pl-6">
          <li
            v-for="(goal, index) in weeklyUpdate.goals"
            :key="index"
            class="list-disc font-light"
          >
            {{ goal }}
          </li>
        </ul>
      </li>
      <li>
        <h4 class="mb-2 font-normal">
          What is your biggest obstacle at the moment?
        </h4>
        <p class="font-light">
          {{ weeklyUpdate.obstacle }}
        </p>
      </li>
      <li class="text-center">
        <h4 class="mb-2 font-normal">Are you satisfied with your progress?</h4>
        <smile-outlined
          v-if="weeklyUpdate.weeklyUpdateProgress !== 'POORLY'"
          :style="{ fontSize: '25px', color: '#3E80FA' }"
        />
        <frown-outlined
          v-else
          :style="{ fontSize: '25px', color: '#3E80FA' }"
        />
      </li>
    </ul>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { WeeklyUpdate } from "~/types/weekly-updates";

defineProps({
  weeklyUpdate: {
    type: Object as PropType<WeeklyUpdate>,
    required: true,
  },
});
</script>
