<template>
  <section>
    <header-teleport-left>
      <div class="flex items-center gap-x-10">
        <nuxt-link
          to="/tasks"
          class="text-xl text-violet cursor-pointer flex items-center hover:text-violet"
        >
          <arrow-left-outlined />
        </nuxt-link>
        <h1 class="text-xl font-medium leading-6 text-violet mb-0">
          Review Feedback
        </h1>
      </div>
    </header-teleport-left>

    <c-table
      :columns="tableColumns"
      :items="taskFeedbacksView"
      :loading="isFetchingTaskFeedbacks"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'studentFirstName'">
          <nuxt-link
            :to="`/students/${record.studentId}`"
            class="text-sm leading-[22px] font-normal underline hover:underline"
          >
            {{ record.studentFirstName }}
          </nuxt-link>
        </template>
        <template v-if="column.key === 'rateValue'">
          <component
            :is="rateIcon[record.rateValue]"
            :style="{ color: '#3E80FA', fontSize: '25px' }"
          />
        </template>
      </template>
    </c-table>
  </section>
</template>
<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { useRoute } from "#app";
import { FunctionalComponent } from "vue";
import {
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";
import CTable from "~/components/ui/CTable.vue";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft";
import { computed } from "#imports";
import { useFetchTaskFeedbacks } from "~/composables/tasks/useFetchTaskFeedbacks";
import { Rate } from "~/types/common";

const taskId = computed(() => useRoute().params.id as string);

const tableColumns: ColumnsType = [
  {
    title: "Student",
    key: "studentFirstName",
    dataIndex: "studentFirstName",
    width: "15.25rem",
  },
  {
    title: "Submitted Date",
    key: "submittedDate",
    dataIndex: "submittedDate",
    width: "14.563rem",
  },
  {
    title: "Mood",
    key: "rateValue",
    dataIndex: "rateValue",
    width: "3.938rem",
  },
  {
    title: "Comment",
    key: "feedback",
    dataIndex: "feedback",
    width: "40.5rem",
  },
];

const rateIcon: Record<Rate, FunctionalComponent> = {
  [Rate.Sad]: FrownOutlined,
  [Rate.Funny]: SmileOutlined,
  [Rate.Neutral]: MehOutlined,
};

const { taskFeedbacksView, isFetchingTaskFeedbacks } =
  await useFetchTaskFeedbacks(taskId.value);
</script>
