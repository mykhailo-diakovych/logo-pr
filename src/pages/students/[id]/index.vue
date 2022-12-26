<template>
  <section class="single-student pb-10">
    <header-teleport-left>
      <student-details-header />
    </header-teleport-left>

    <section class="max-w-[1048px] ml-[4rem]">
      <section
        class="border border-solid border-gallery rounded-md px-5 py-4 mb-[30px]"
      >
        <a-row :gutter="[30]">
          <a-col :span="12">
            <a-row :gutter="22">
              <a-col :span="10">
                <student-details-card title="Status">
                  <span :class="studentStatusColor">
                    {{ studentViewInformation?.studentStatus || "-" }}
                  </span>
                </student-details-card>
              </a-col>
              <a-col v-if="isStudentHasAppliedStatus" :span="14">
                <student-details-card title="Screening Status">
                  {{ studentViewInformation?.screeningStatus }}
                </student-details-card>
              </a-col>
              <a-col v-else :span="10">
                <student-details-card title="Weekly Updates">
                  <a-progress
                    :percent="weeklyUpdatesPercent"
                    trail-color="#F5F5F5"
                    :show-info="true"
                  >
                    <template #format="">
                      <span>
                        {{ weeklyUpdatesSum.completed }}/{{
                          weeklyUpdatesSum.total
                        }}
                      </span>
                    </template>
                  </a-progress>
                </student-details-card>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row :gutter="24">
              <a-col v-if="isStudentHasAppliedStatus" :span="12">
                <student-details-card title="Weekly Updates">
                  <a-progress
                    :percent="weeklyUpdatesPercent"
                    trail-color="#F5F5F5"
                    :show-info="true"
                  >
                    <template #format="">
                      <span>
                        {{ weeklyUpdatesSum.completed }}/{{
                          weeklyUpdatesSum.total
                        }}
                      </span>
                    </template>
                  </a-progress>
                </student-details-card>
              </a-col>
              <a-col :span="12">
                <student-details-card title="Tasks">
                  <a-progress
                    :percent="tasksSumPercent"
                    stroke-color="#F19876"
                    trail-color="#F5F5F5"
                    :show-info="true"
                  >
                    <template #format="">
                      <span>
                        {{ tasksSum.approved }}/{{ tasksSum.total }}
                      </span>
                    </template>
                  </a-progress>
                </student-details-card>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </section>

      <section class="px-5">
        <a-row :gutter="30">
          <a-col :span="12">
            <a-row :gutter="[22, 20]">
              <a-col
                v-for="(studentCard, index) in studentInformation"
                :key="studentCard.key"
                :span="index % 2 ? 14 : 10"
              >
                <student-details-card :title="studentCard.title">
                  <component
                    :is="studentCard.component"
                    v-if="studentCard.component"
                    class="mt-1"
                    v-bind="studentCard.props"
                  />
                  <template v-else>
                    {{ studentViewInformation?.[studentCard.key] || "-" }}
                  </template>
                </student-details-card>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <student-details-card
              title="Cover Letter"
              :value="student?.coverLetter"
            />
          </a-col>
        </a-row>
      </section>
    </section>

    <section class="mt-[30px]">
      <student-logs />
    </section>

    <template v-if="student">
      <student-accept-application-modal
        v-model:visible="isAcceptApplicationModalActive"
        :student="student"
      />
      <student-reject-modal
        v-model:visible="isRejectApplicationModalActive"
        :student="student"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from "#app";
import { storeToRefs } from "pinia";

import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  useToggle,
  watch,
} from "#imports";
import { StudentInformationOption, StudentStatus } from "~/types/students";
import StudentLogs from "~/components/students/details/logs/StudentLogs.vue";
import { useActivityLogsStore } from "~/store/activity-logs/useActivityLogsStore";
import StudentAcceptApplicationModal from "~/components/students/details/modals/StudentAcceptApplicationModal.vue";
import StudentRejectModal from "~/components/students/details/modals/StudentRejectModal.vue";
import { useStudentStore } from "~/store/students/useStudentStore";
import { useNotesStore } from "~/store/notes/useNotesStore";
import { useWeeklyUpdatesStore } from "~/store/weekly-updates/useWeeklyUpdatesStore";
import StudentDetailsCard from "~/components/students/details/StudentDetailsCard.vue";
import StudentDetailsHeader from "~/components/students/details/StudentDetailsHeader.vue";
import { getFullName } from "~/helpers/utils";
import { studentStatusColors } from "~/constants/student";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import { useFetchStudentSummary } from "~/composables/students/useFetchStudentSummary";

const route = useRoute();

const studentId = computed<string>(() => route.params.id as string);

const studentStore = useStudentStore();
const { studentViewInformation, student } = storeToRefs(studentStore);
const { fetchStudent, fetchAllStudentTasks } = studentStore;
const { noteFilters } = storeToRefs(useNotesStore());
const { fetchWeeklyUpdates } = useWeeklyUpdatesStore();
const { fetchActivityLogs } = useActivityLogsStore();
const {
  fetchStudentSummary,
  studentTasksSummary: tasksSum,
  studentWeeklyUpdatesSummary: weeklyUpdatesSum,
  studentWeeklyUpdatesSummaryDonePercent: weeklyUpdatesPercent,
  studentTasksSummaryDonePercent: tasksSumPercent,
} = useFetchStudentSummary();

const mentorFullName = computed(() =>
  getFullName(student.value?.mentorDetails)
);

const studentStatusColor = computed(() =>
  student.value
    ? studentStatusColors[student.value.studentStatus]
    : studentStatusColors[StudentStatus.Applied]
);
const isStudentHasAppliedStatus = computed(
  () => student.value?.studentStatus === StudentStatus.Applied
);

onBeforeMount(() => fetchStudent(studentId.value));

const fetchStudentDependency = (studentId: string) => {
  noteFilters.value.studentId = studentId;

  Promise.allSettled([
    fetchWeeklyUpdates({ studentId }),
    fetchActivityLogs({ studentId }),
    fetchAllStudentTasks({ studentId }),
    fetchStudentSummary(studentId),
  ]);
};

watch(
  student,
  (updatedStudent) =>
    updatedStudent && fetchStudentDependency(updatedStudent.id)
);

const [isAcceptApplicationModalActive, toggleAcceptApplicationModal] =
  useToggle();
const [isRejectApplicationModalActive, toggleRejectApplicationModal] =
  useToggle();

const studentInformation = computed<StudentInformationOption[]>(() => [
  ...(student.value?.studentStatus !== StudentStatus.Applied &&
  student.value?.studentStatus !== StudentStatus.Rejected
    ? ([
        {
          title: "Mentor",
          key: "mentorDetails",
          component: defineAsyncComponent(
            () =>
              import(
                "~/components/students/details/mentor/StudentDetailsUpdateMentor.vue"
              )
          ),
          props: {
            studentId: studentId.value,
            mentorFullName: mentorFullName.value,
          },
        },
      ] as StudentInformationOption[])
    : []),
  { title: "Email", key: "email" },
  { title: "Gender", key: "gender" },
  { title: "Education", key: "education" },
  { title: "Date of Birth", key: "dateOfBirth" },
  { title: "English level", key: "englishLevel" },
  { title: "Course", key: "occupation" },
  {
    title: "Resume",
    key: "resume",
    component: defineAsyncComponent(
      () => import("~/components/students/details/StudentDetailsResume.vue")
    ),
    props: {
      resume: student.value?.resume,
    },
  },
]);
</script>

<style lang="scss">
.single-student {
  &__dropdown {
    .ant-dropdown {
      &-menu {
        &-item {
          @apply mb-0;
        }
      }
    }
  }

  .ant-progress {
    @apply flex items-center;

    & > span {
      @apply text-xs leading-5 font-normal text-gray-1;
    }
  }
}
</style>
