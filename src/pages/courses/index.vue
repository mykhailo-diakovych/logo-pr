<template>
  <section>
    <a-tabs v-model:active-key="selectedCourseStatus">
      <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.title" />

      <template v-if="isAddCourseButtonDisplayed" #rightExtra>
        <c-button-action @click="toggleCoursesEditModal(true)">
          Add Course
        </c-button-action>
      </template>
    </a-tabs>

    <section>
      <CTable
        v-model:current="coursesFilters.page"
        :items="computedCourses"
        :columns="tableColumns"
        :total="totalCourses"
        :loading="isLoadingCourses"
        :scroll="{ y: 'calc(100vh - 255px)' }"
      >
        <template #column-action="{ item }">
          <a-menu>
            <a-menu-item
              v-for="(action, index) in tableActions"
              :key="index"
              @click="action.handler(item)"
            >
              <component :is="action.icon" v-if="action.icon" />
              {{ action.title }}
            </a-menu-item>
          </a-menu>
        </template>
      </CTable>
    </section>

    <courses-edit-modal
      v-model:visible="isCoursesEditModalActive"
      v-model:selected-course-id="selectedCourseId"
    />
  </section>
</template>

<script lang="ts" setup>
import { Modal } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ColumnsType } from "ant-design-vue/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import {
  computed,
  definePageMeta,
  onMounted,
  ref,
  useToggle,
  watch,
} from "#imports";
import { useCoursesStore } from "~/store/courses/useCoursesStore";
import CTable from "~/components/ui/CTable.vue";
import { Course, CourseStatus } from "~/types/courses";
import Courses from "~/services/courses";
import CoursesEditModal from "~/components/courses/CoursesEditModal.vue";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { Occupation } from "~/types/common";

definePageMeta({
  title: "Courses",
});

const tabs = [
  {
    id: CourseStatus.Scheduled,
    title: "Scheduled",
    value: CourseStatus.Scheduled,
  },
  {
    id: CourseStatus.Active,
    title: "Active",
    value: CourseStatus.Active,
  },
  {
    id: CourseStatus.Completed,
    title: "Completed",
    value: CourseStatus.Completed,
  },
];

const { occupationConstant, courseStatusConstant } = storeToRefs(
  useConstantsStore()
);
const coursesStore = useCoursesStore();
const { courses, totalCourses, coursesFilters, isLoadingCourses } =
  storeToRefs(coursesStore);
const { fetchCourses, removeCourse } = coursesStore;
onMounted(fetchCourses);

const [isCoursesEditModalActive, toggleCoursesEditModal] = useToggle();
const isAddCourseButtonDisplayed = computed(
  () => coursesFilters.value.courseStatus === CourseStatus.Scheduled
);

const computedCourses = computed(() =>
  courses.value.map((course) => ({
    ...course,
    startDate: dayjs(course.startDate).format("MMMM DD, YYYY"),
    endDate: dayjs(course.endDate).format("MMMM DD, YYYY"),
    occupation: occupationConstant.value?.[course.occupation],
    courseStatusCaption: courseStatusConstant.value?.[course.courseStatus],
  }))
);

const selectedCourseStatus = ref<CourseStatus>(
  coursesFilters.value.courseStatus
);
watch(selectedCourseStatus, (status) => {
  coursesFilters.value.courseStatus = status;
  coursesFilters.value.page = 0;
});

const tableColumns: ColumnsType = [
  {
    title: "Course name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Occupation",
    dataIndex: "occupation",
    key: "occupation",
  },
  {
    title: "Start date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "Students",
    dataIndex: "studentsCount",
    key: "studentsCount",
  },
  {
    title: "Status",
    dataIndex: "courseStatusCaption",
    key: "courseStatusCaption",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
  },
];
const tableActions = computed(() => {
  const editAction = {
    title: "Edit",
    icon: EditOutlined,
    handler: onClickUpdateCourse,
  };
  const deleteAction = {
    title: "Delete",
    icon: DeleteOutlined,
    handler: openCourseRemoveModal,
  };
  const viewDetailsAction = {
    title: "View details",
    icon: EyeOutlined,
    handler: (course: Course) => useRouter().push(`/courses/${course.id}`),
  };

  const actions = [];

  if (coursesFilters.value.courseStatus !== CourseStatus.Completed)
    actions.push(editAction);

  if (
    [CourseStatus.Draft, CourseStatus.Scheduled].includes(
      coursesFilters.value.courseStatus
    )
  )
    actions.push(deleteAction);

  if (coursesFilters.value.courseStatus === CourseStatus.Completed)
    actions.push(viewDetailsAction);

  return actions;
});

const openCourseRemoveModal = (course: Course) => {
  Modal.confirm({
    title: `Are you sure you want to delete the course "${course.name}"?`,
    okText: "Yes",
    cancelText: "No",
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    okButtonProps: {
      type: "text",
    },
    width: 671,
    onOk: () => removeCourse(course.id),
  });
};

const selectedCourseId = ref<string | null>(null);

const onClickUpdateCourse = (course: Course) => {
  selectedCourseId.value = course.id;
  toggleCoursesEditModal(true);
};
</script>
