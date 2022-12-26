import { ref, useToggle } from "#imports";
import Feedbacks from "~/services/feedbacks";
import { Feedback } from "~/types/feedbacks";

export const useFetchStudentFeedback = () => {
  const studentFeedback = ref<Feedback | null>(null);
  const [isFetchingStudentFeedback, toggleFetchingStudentFeedback] =
    useToggle();

  const fetchStudentFeedback = async (studentId: string) => {
    toggleFetchingStudentFeedback(true);

    try {
      studentFeedback.value = await Feedbacks.getByStudentId(studentId);
    } finally {
      toggleFetchingStudentFeedback(false);
    }
  };

  return { studentFeedback, isFetchingStudentFeedback, fetchStudentFeedback };
};
