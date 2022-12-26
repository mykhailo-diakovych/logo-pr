<template>
  <div class="c-calendar-line flex items-center gap-x-4">
    <full-calendar ref="calendar" :options="options" />

    <a-select
      :value="currentMonth"
      :options="months"
      default-value="January"
      @update:value="changeMonth"
    />
  </div>
</template>

<script setup lang="ts">
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { CalendarOptions } from "@fullcalendar/common";
import dayjs from "dayjs";
import { PropType } from "vue";
import { computed, onMounted, ref } from "#imports";
import { WeeklyUpdate } from "~/types/weekly-updates";

const props = defineProps({
  weeklyUpdates: {
    type: Array as PropType<WeeklyUpdate[]>,
    required: true,
    default: () => [],
  },
});

const parseStartAndEndDate = (
  date: string,
  startOrEnd: "startOf" | "endOf"
) => {
  return dayjs(date)[startOrEnd]("week").format("YYYY-MM-DD");
};

const calendar = ref<InstanceType<typeof FullCalendar>>();

const options = computed<CalendarOptions>(() => ({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin,
    resourceTimelinePlugin,
  ],
  initialView: "timelineMonth",
  headerToolbar: {
    start: "",
    center: "",
    end: "",
  },
  datesSet: ({ start }: { start: Date }) =>
    (currentMonth.value = start.getMonth()),
  slotLabelFormat: (data: any) => data.date.day,
  events: props.weeklyUpdates.map((weeklyUpdate) => {
    return {
      start: parseStartAndEndDate(weeklyUpdate.updatingUntil, "startOf"),
      end: parseStartAndEndDate(weeklyUpdate.updatingUntil, "endOf"),
    };
  }),
}));
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, value) => ({ label, value }));
const isCalendarMounted = ref<boolean>(false);
const currentMonth = ref<number>(new Date().getMonth());
onMounted(() => (isCalendarMounted.value = true));

const changeMonth = (month: number) => {
  currentMonth.value = month;
  const date = new Date();
  date.setMonth(month);
  calendar.value?.getApi().changeView("timelineMonth", date);
};
</script>

<style lang="scss">
.c-calendar-line {
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    @apply rounded-md flex items-center justify-center;

    .ant-select-selection-item {
      @apply text-sm leading-[22px] font-normal text-violet;
    }
  }

  .fc {
    @apply w-full;

    &-scrollgrid td {
      padding: 0 !important;
    }
    &-toolbar.fc-header-toolbar {
      margin-bottom: 0;
    }
  }

  .fc-media-screen {
    thead {
      .fc-scroller {
        overflow: auto !important;
        margin-bottom: -2px;

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
    }

    .fc-timeline-header {
      //overflow: scroll;
    }

    .fc {
      &-scroller {
        //overflow: hidden !important;

        &::-webkit-scrollbar {
          //width: 0;
          height: 4px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
          background: #fff;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
          background: #3e80fa;
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #3e80fa;
        }
      }

      &-today-button {
        @apply hidden;
      }

      &-toolbar-title {
        @apply text-sm font-normal leading-4 text-violet;
      }

      &-button {
        @apply bg-white border-blue text-blue rounded-md py-0.5 text-base leading-[15px] transition-all duration-500;

        &-primary:focus {
          box-shadow: none !important;
        }

        &-primary:active {
          @apply bg-blue border-blue;
        }
      }

      &-view-harness {
        height: 60px !important;
      }

      &-scrollgrid {
        @apply border-0;

        &-section {
          th,
          td {
            border: none !important;
          }
          th.fc-day {
            &:nth-of-type(7n + 1) {
              &::before {
                content: "";
                width: 1px;
                height: 46px;
                left: 0;
                top: -14px;
                z-index: 10;
                background: #d3d3d3;
                position: absolute;
              }
            }
          }
        }
      }

      &-timeline {
        &-body {
          height: 1.25rem !important;
          @apply p-1 bg-gallery rounded-md;
        }

        &-events {
          height: 1.25rem !important;
          background-color: #d3d3d3 !important;
        }

        &-event {
          @apply h-3 rounded-md;

          &-harness {
            @apply pr-2;
          }
        }
      }

      &-timeline {
        &-slot {
          @apply border-0;

          &:nth-of-type(7n + 1) {
            @apply relative;
            &:is(td) {
              &::before {
                content: "";
                width: 1px;
                height: 46px;
                left: -4px;
                top: -20px;
                background: #d3d3d3;
                position: absolute;
              }
            }
          }

          &-cushion {
            @apply text-xs leading-6 tracking-[0.045em] text-bombay;
          }
        }
      }

      &-license-message {
        @apply hidden;
      }

      &-header-toolbar {
        .fc-toolbar-chunk {
          @apply flex items-center;
        }
      }
    }
  }
}
</style>
