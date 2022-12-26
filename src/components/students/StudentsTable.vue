<template>
  <CTable :items="computesStudents" :columns="tableColumns" />
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { ColumnsType } from "ant-design-vue/es/table";
import CTable from "~/components/ui/CTable.vue";
import { Student } from "~/types/students";
import { computed } from "#imports";

const props = defineProps({
  students: {
    type: Array as PropType<Student[]>,
    default: () => [],
  },
});

const computesStudents = computed(() =>
  props.students.map((student) => ({
    ...student,
    fullName: `${student.firstName} ${student.lastName}`,
  }))
);

const tableColumns: ColumnsType = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Country",
    dataIndex: ["address", "country"],
    key: "address.country",
  },
  {
    title: "Course",
    dataIndex: "occupation",
    key: "occupation",
  },
  {
    title: "Applied At",
    dataIndex: "appliedAt",
    key: "appliedAt",
  },
  {
    title: "Review/Screening status",
    dataIndex: "screeningStatus",
    key: "screeningStatus",
  },
];
</script>
