<template>
  <section>
    <header-teleport-left>
      <div class="flex items-center gap-x-10">
        <nuxt-link
          to="/courses"
          class="text-xl text-violet cursor-pointer flex items-center hover:text-violet"
        >
          <arrow-left-outlined />
        </nuxt-link>
        <h1
          v-if="courseDetails?.courseName"
          class="text-xl font-medium leading-6 text-violet mb-0"
        >
          {{ courseDetails?.courseName }}
        </h1>
      </div>
    </header-teleport-left>

    <section class="max-w-[1048px]">
      <section
        class="border w-fit border-solid border-gallery rounded-md px-5 py-4 mb-[30px] flex items-center"
      >
        <div class="pr-8">
          <student-details-card title="Status">
            <span :class="statusColor" class="capitalize">
              {{ courseDetails?.courseStatus?.toLowerCase() || "-" }}
            </span>
          </student-details-card>
        </div>

        <div class="pr-8 ml-[22px]">
          <student-details-card title="Students">
            <span> {{ courseDetails?.totalStudents }} </span>
          </student-details-card>
        </div>

        <div class="pr-8 ml-[22px]">
          <student-details-card title="Start Date">
            <span>
              {{
                courseDetails?.startDate
                  ? formatDateMonthString(courseDetails.startDate)
                  : ""
              }}
            </span>
          </student-details-card>
        </div>

        <div class="ml-[22px]">
          <student-details-card title="End Date">
            <span>
              {{
                courseDetails?.endDate
                  ? formatDateMonthString(courseDetails.endDate)
                  : ""
              }}
            </span>
          </student-details-card>
        </div>
      </section>
    </section>

    <section>
      <CTable :columns="tableColumns" :items="courseDetails?.students?.content">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fullName'">
            {{ record.firstName }} {{ record.lastName }}
          </template>

          <template v-if="column.key === 'startDate'">
            {{ formatDateMonthString(record.startDate) }}
          </template>

          <template v-if="column.key === 'lastActivity'">
            {{
              record.lastActivity
                ? formatDateMonthString(record.lastActive)
                : "-"
            }}
          </template>

          <template v-if="column.key === 'level'">
            <div class="capitalize">
              {{ record.englishLevel.toLowerCase() }}
            </div>
          </template>

          <template v-if="column.key === 'location'">
            <div class="capitalize">
              {{ record.location.toLowerCase() }}
            </div>
          </template>

          <template v-if="column.key === 'feedback'">
            <nuxt-link class="underline" @click="onOpenModalReview(record.id)">
              Review
            </nuxt-link>
          </template>
        </template>

        <template #column-action="{ item }">
          <a-menu>
            <a-menu-item>
              <nuxt-link :to="`/students/${item.id}`" class="flex items-center">
                <eye-outlined />
                View details
              </nuxt-link>
            </a-menu-item>
          </a-menu>
        </template>
      </CTable>
    </section>

    <c-modal-menu
      v-model:visible="isOpenModal"
      title="Feedback"
      :footer="false"
    >
      <div v-html="reviewModalContent" />
    </c-modal-menu>
  </section>
</template>

<script lang="ts" setup>
import { useRoute } from "#app";
import { EyeOutlined } from "@ant-design/icons-vue";
import { formatDateMonthString } from "~/helpers/date";
import StudentDetailsCard from "~/components/students/details/StudentDetailsCard.vue";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import { useFetchCourseDetails } from "~/composables/courses/useFetchCourseDetails";
import { computed } from "#imports";
import { coursesStatusColor } from "~/constants/courses";
import { CourseStatus } from "~/types/courses";
import CTable from "~/components/ui/CTable.vue";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import Feedbacks from "~/services/feedbacks";

const route = useRoute();
const courseId = computed(() => route.params.id as string);

const { courseDetails } = useFetchCourseDetails(courseId.value);

const statusColor = computed(() =>
  courseDetails.value
    ? coursesStatusColor[courseDetails.value.courseStatus]
    : coursesStatusColor[CourseStatus.Draft]
);

const tableColumns = ref([
  {
    title: "Students",
    dataIndex: "fullName",
    key: "fullName",
    width: "278px",
  },
  {
    title: "Occupation",
    dataIndex: "occupation",
    key: "occupation",
    width: "212px",
  },
  {
    title: "Level",
    dataIndex: "englishLevel",
    key: "level",
    width: "128px",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    width: "128px",
  },
  {
    title: "Feedback",
    dataIndex: "feedback",
    key: "feedback",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
  },
]);

const reviewModalContent = ref();
const [isOpenModal, toggleModal] = useToggle(false);
const onOpenModalReview = async (id: string) => {
  try {
    const data = await Feedbacks.getByStudentId(id);

    toggleModal(true);
    reviewModalContent.value = data.content;
  } catch (e) {
    console.log(e);
  }
};
</script>
