import { CourseDetails } from "~/types/courses";
import Courses from "~/services/courses";

export const useFetchCourseDetails = (courseId: string) => {
  const courseDetails = ref<CourseDetails | null>(null);

  const fetchCourseDetails = async () => {
    courseDetails.value = await Courses.getDetails(courseId);
  };

  onBeforeMount(fetchCourseDetails);

  return { courseDetails };
};
