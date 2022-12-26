import { notification } from "ant-design-vue";
import { useToggle } from "#imports";
import Feedbacks from "~/services/feedbacks";
import { useFeedbackStore } from "~/store/feedbacks/useFeedbackStore";

export const useSubmitStudentFeedback = () => {
  const [isSubmittingStudentFeedback, toggleSubmittingStudentFeedback] =
    useToggle();

  const submitStudentFeedback = async (studentId: string) => {
    toggleSubmittingStudentFeedback(true);

    try {
      await Feedbacks.submit(studentId);

      notification.success({
        message: "You successfully leave feedback for student",
      });

      await useFeedbackStore().fetchStudentFeedback(studentId);
    } finally {
      toggleSubmittingStudentFeedback(false);
    }
  };

  return { submitStudentFeedback, isSubmittingStudentFeedback };
};
