<template>
  <c-table :columns="tableColumns" :items="feedbacks" />
</template>

<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import CTable from "~/components/ui/CTable.vue";
import { useFeedbackStore } from "~/store/feedbacks/useFeedbackStore";

const tableColumns: ColumnsType = [
  { title: "Date update", dataIndex: "updatedAt", key: "updatedAt" },
  { title: "Comment", dataIndex: "content", key: "content" },
];
const { feedbacks } = storeToRefs(useFeedbackStore());
</script>
