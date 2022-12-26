<template>
  <section>
    <a-tabs v-model:activeKey="studentsFilters.studentStatus">
      <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.title" />

      <template #rightExtra>
        <c-filter-input @update:value="onSearchStudents" />
      </template>
    </a-tabs>

    <section>
      <CTable
        v-model:current="studentsFilters.page"
        :items="computesStudents"
        :total="totalStudents"
        :columns="tableColumns"
        :actions="tableActions"
        :loading="isFetchingStudents"
        :scroll="{ y: 'calc(100vh - 260px)' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'screeningStatusCaption'">
            <c-status no-bg :color="tableStatusColors[record.screeningStatus]">
              {{ record.screeningStatusCaption }}
            </c-status>
          </template>
        </template>
      </CTable>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ColumnsType } from "ant-design-vue/es/table";
import dayjs from "dayjs";
import { EyeOutlined } from "@ant-design/icons-vue";
import { useRouter } from "#app";
import { useStudentsStore } from "~/store/students/useStudentsStore";
import { computed, definePageMeta, onBeforeMount, watch } from "#imports";
import { Student, StudentStatus } from "~/types/students";
import CTable from "~/components/ui/CTable.vue";
import CFilterInput from "~/components/ui/filter/CFilterInput.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { TableActions } from "~/types/table";
import CStatus from "~/components/ui/CStatus.vue";
import { ApplicationStatus } from "~/types/common";

definePageMeta({
  title: "Students",
});
const tabs = [
  { id: StudentStatus.Applied, title: "New Applicants" },
  {
    id: StudentStatus.Active,
    title: "Active Students",
  },
  {
    id: StudentStatus.Rejected,
    title: "Rejected Applicants",
  },
  {
    id: StudentStatus.Former,
    title: "Former Students",
  },
];

const router = useRouter();
const studentsStore = useStudentsStore();
const { students, totalStudents, studentsFilters, isFetchingStudents } =
  storeToRefs(studentsStore);
const { fetchStudents } = studentsStore;
const { gendersConstant, occupationConstant, screeningStatusConstant } =
  storeToRefs(useConstantsStore());

onBeforeMount(fetchStudents);
watch(
  () => studentsFilters.value.studentStatus,
  () => (studentsFilters.value.page = 0)
);

const computesStudents = computed(() =>
  students.value.map((student) => ({
    ...student,
    fullName: `${student.firstName} ${student.lastName}`,
    gender: gendersConstant.value?.[student.gender],
    occupation: occupationConstant.value?.[student.occupation],
    screeningStatusCaption:
      screeningStatusConstant.value?.[student.screeningStatus],
    appliedAt:
      student.appliedAt === "null"
        ? ""
        : dayjs(student.appliedAt).format("MMMM DD, YYYY"),
  }))
);

let searchTimeout: null | NodeJS.Timeout = null;
const onSearchStudents = (value: string) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => (studentsFilters.value.search = value), 300);
};

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
    title: "Screening status",
    dataIndex: "screeningStatusCaption",
    key: "screeningStatusCaption",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
  },
];
const tableActions: TableActions<Student> = [
  {
    title: "Review",
    icon: EyeOutlined,
    handler: (student) => router.push(`/students/${student.id}`),
  },
];
const tableStatusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Clarification]: "green",
  [ApplicationStatus.IntroCall]: "blue",
  [ApplicationStatus.TestTask]: "orange",
  [ApplicationStatus.Accepted]: "green",
  [ApplicationStatus.Applied]: "blue",
  [ApplicationStatus.Reject]: "red",
};
</script>

<style lang="scss">
.c-table-wrapper {
  .c-button {
    .ant-btn {
      @apply border-blue text-blue flex items-center justify-center px-4 py-0.5 rounded-[6px] h-7;

      span:first-of-type {
        @apply text-sm leading-[22px] h-3.5 w-3.5 flex items-center justify-center;
      }
    }
  }

  .ant-tabs {
    &-nav {
      @apply mb-0 before:border-b-alabaster;

      &-list {
      }
    }

    &-tab {
      @apply py-3 text-sm leading-[22px] text-bombay;

      &-btn {
        @apply text-bombay;
      }

      &-active .ant-tabs-tab-btn {
        @apply text-blue font-semibold;
        text-shadow: none;
      }
    }

    &-ink-bar {
      background: none;
      @apply bg-blue;
    }
  }

  .ant-input {
    &-suffix {
      @apply text-bombay transition-all duration-500 hover:text-violet cursor-pointer;
    }

    &-affix-wrapper {
      @apply rounded-md bg-alabaster px-3 py-1 text-sm leading-[22px] font-normal placeholder:text-bombay text-violet border-0;

      &-focused,
      &:focus,
      &:hover {
        box-shadow: none !important;
        border-right-width: 0 !important;
      }
    }

    @apply bg-alabaster text-sm leading-[22px] font-normal placeholder:text-bombay text-violet border-0;

    &:hover {
      border-right-width: 0 !important;
    }
  }

  .ant-input:focus,
  .ant-input-focused {
    @apply bg-alabaster;
    box-shadow: none;
    border-right-width: 0 !important;
    outline: 0;
  }

  input:hover,
  input:focus {
    -webkit-box-shadow: none !important;
  }
}
</style>
