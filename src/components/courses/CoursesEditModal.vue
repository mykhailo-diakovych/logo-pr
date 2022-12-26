<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :title="title"
    :ok-text="submitCaption"
    cancel-text="Cancel"
    centered
    :confirm-loading="isLoading"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[30, 20]">
        <a-col :span="isEditable ? 12 : 24">
          <a-form-item label="Course name" v-bind="validateInfos.name">
            <a-input
              v-model:value="formModel.name"
              bordered
              placeholder="Enter Course Name"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="isEditable" :span="12">
          <a-form-item label="Status" v-bind="validateInfos.courseStatus">
            <a-select
              v-model:value="formModel.courseStatus"
              :options="courseStatusOptions"
              placeholder="Select status"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Start date" v-bind="validateInfos.startDate">
            <a-date-picker
              v-model:value="startDate"
              size="large"
              :format="dateFormat"
              :disabled-date="(date) => date < new Date().getTime()"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="End date" v-bind="validateInfos.endDate">
            <a-date-picker
              v-model:value="endDate"
              size="large"
              :format="dateFormat"
              :disabled-date="(date) => date < new Date().getTime()"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Occupation" v-bind="validateInfos.occupation">
            <a-select
              v-model:value="formModel.occupation"
              placeholder="Select Occupation"
              :options="courseOccupationOptions"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Level" v-bind="validateInfos.techStackLevel">
            <a-select
              v-model:value="formModel.techStackLevel"
              placeholder="Select Level"
              :options="courseLevelOptions"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Price" v-bind="validateInfos.price">
            <a-select
              v-model:value="formModel.price"
              placeholder="Select Price"
              :options="coursePriceOptions"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Location" v-bind="validateInfos.location">
            <a-select
              v-model:value="formModel.location"
              placeholder="Select Location"
              :options="courseLocationOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Form } from "ant-design-vue";
import dayjs from "dayjs";
import {
  CourseLocation,
  CoursePayload,
  CoursePrice,
  CourseStatus,
  CourseTechStackLevel,
} from "~/types/courses";
import { computed, reactive, ref, useVModel, watch } from "#imports";
import Courses from "~/services/courses";
import { Occupation } from "~/types/common";
import { useCoursesStore } from "~/store/courses/useCoursesStore";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { convertEnumToSelectOptions } from "~/helpers/utils";

const props = defineProps({
  selectedCourseId: {
    type: String as PropType<string>,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
  (e: "update:selectedCourseId", flag: boolean): void;
}>();
const isEditable = computed(() => !!props.selectedCourseId);
const title = computed(() =>
  isEditable.value ? "Update course" : "Add course"
);
const submitCaption = computed(() => (isEditable.value ? "Save" : "Create"));

const isModalActive = useVModel(props, "visible", emit);
const selectedCourseId = useVModel(props, "selectedCourseId", emit);

const coursePriceOptions = convertEnumToSelectOptions(CoursePrice);
const courseLevelOptions = convertEnumToSelectOptions(CourseTechStackLevel);
const courseLocationOptions = convertEnumToSelectOptions(CourseLocation);
const courseOccupationOptions = convertEnumToSelectOptions(Occupation);
const courseStatusOptions = convertEnumToSelectOptions(CourseStatus);

const formModel = reactive<Record<keyof CoursePayload, string | null>>({
  name: "",
  occupation: null,
  startDate: "",
  endDate: "",
  techStackLevel: null,
  price: null,
  location: null,
  courseStatus: null,
});

const startDate = computed({
  get() {
    if (!formModel.startDate) return null;

    return dayjs(formModel.startDate);
  },
  set(value) {
    formModel.startDate = value ? value.toDate().toISOString() : "";
  },
});
const endDate = computed({
  get() {
    if (!formModel.endDate) return null;

    return dayjs(formModel.endDate);
  },
  set(value) {
    formModel.endDate = value ? value.toDate().toISOString() : "";
  },
});
const dateFormat = "DD.MM.YYYY";

const formModelRules = reactive({
  name: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  occupation: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  startDate: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  endDate: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  techStackLevel: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  price: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  location: [
    {
      required: true,
      message: "This field is required",
    },
  ],
});

const { validate, validateInfos, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const isLoading = ref(false);
const { createCourse, updateCourse } = useCoursesStore();

const onSubmit = async () => {
  if (!(await validate())) return;

  isLoading.value = true;

  try {
    isEditable.value
      ? await updateCourse(props.selectedCourseId, formModel as CoursePayload)
      : await createCourse(formModel as CoursePayload);

    isModalActive.value = false;
  } finally {
    isLoading.value = false;
  }
};

watch(isModalActive, (active) => {
  if (!active) selectedCourseId.value = "";
  else resetFields();
});
watch([isModalActive, selectedCourseId], async ([active, courseId]) => {
  if (!active || !courseId) return;

  const selectedCourse = await Courses.getById(selectedCourseId.value);

  Object.keys(formModel).forEach((key) => {
    formModel[key] = selectedCourse[key];
  });
});
</script>
