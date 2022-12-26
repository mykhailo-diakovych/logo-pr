import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import CoursesService from "~/services/courses";
import { useFilters } from "~/composables/useFilters";
import {
  Course,
  CourseFilters,
  CoursePayload,
  CourseStatus,
} from "~/types/courses";

export const useCoursesStore = defineStore("Courses", () => {
  const {
    filteredItems: courses,
    filters: coursesFilters,
    loading: isLoadingCourses,
    totalFilteredItems: totalCourses,
    fetchFilteredItems: fetchCourses,
  } = useFilters<Course, CourseFilters>(CoursesService, {
    page: 0,
    courseStatus: CourseStatus.Scheduled,
  });

  const createCourse = async (payload: CoursePayload) => {
    await CoursesService.create(payload);

    notification.success({
      message: "You successfully create new course",
    });

    await fetchCourses();
  };

  const updateCourse = async (id: string, payload: CoursePayload) => {
    await CoursesService.update(id, payload);

    notification.success({
      message: "You successfully update course",
    });

    await fetchCourses();
  };

  const removeCourse = async (id: string) => {
    await CoursesService.deleteById(id);

    notification.success({
      message: "You successfully remove this course",
    });

    await fetchCourses();
  };

  return {
    courses,
    totalCourses,
    coursesFilters,
    isLoadingCourses,
    fetchCourses,
    createCourse,
    updateCourse,
    removeCourse,
  };
});
