<template>
  <div class="flex items-center">
    <div class="mr-[18px]">Progress</div>

    <div class="h-2.5 rounded-md bg-gallery w-full p-0.5">
      <a-row :gutter="[4, 4]">
        <a-col v-for="i in 4" :key="i" :span="6">
          <div class="relative">
            <div
              class="h-1.5 w-full rounded-md bg-blue transition-all duration-500"
            />
            <div
              class="absolute top-full left-1/2 -translate-x-1/2 text-xs font-normal leading-[14px] text-silverChalice mt-1"
            >
              week {{ i }}
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <div class="ml-2.5">
      <a-select default-value="January">
        <a-select-option
          v-for="item in months"
          :key="item.value"
          :value="item.value"
        >
          {{ item.title }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { ref } from "#imports";
import { StudentSummary } from "~/types/dashboard";

const props = defineProps({
  studentSummary: {
    type: Object as PropType<StudentSummary>,
    required: true,
  },
});

const months = ref([
  {
    value: "1",
    title: "January",
  },
  {
    value: "2",
    title: "February",
  },
  {
    value: "3",
    title: "March",
  },
  {
    value: "4",
    title: "April",
  },
  {
    value: "5",
    title: "May",
  },
  {
    value: "6",
    title: "June",
  },
  {
    value: "7",
    title: "July",
  },
  {
    value: "8",
    title: "August",
  },
  {
    value: "9",
    title: "September",
  },
  {
    value: "10",
    title: "October",
  },
  {
    value: "11",
    title: "November",
  },
  {
    value: "12",
    title: "December",
  },
]);

// const getDoneWeeks = (record, month) =>
//   record.weekly_update.find((item) => item.month === month)?.done;
//
// const done = ref(0);
//
// const animateProgress = (val) => {
//   const interval = setInterval(() => {
//     if (done.value === val) {
//       clearInterval(interval);
//     } else {
//       done.value = done.value + 1;
//     }
//   }, 350);
// };
//
// onMounted(() => animateProgress(getDoneWeeks(props.record, "1")));
</script>
