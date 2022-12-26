import { notification } from "ant-design-vue";
import { useToggle } from "#imports";
import Feedbacks from "~/services/feedbacks";
import { useFeedbackStore } from "~/store/feedbacks/useFeedbackStore";

export const useUpdateStudentFeedback = () => {
  const [isUpdatingStudentFeedback, toggleUpdatingStudentFeedback] =
    useToggle();

  const updateStudentFeedback = async (studentId: string, feedback: string) => {
    toggleUpdatingStudentFeedback(true);
    try {
      await Feedbacks.update(studentId, feedback);

      notification.success({
        message: "You successfully updated draft feedback",
      });

      useFeedbackStore().fetchStudentFeedback(studentId);
    } finally {
      toggleUpdatingStudentFeedback(false);
    }
  };

  return { isUpdatingStudentFeedback, updateStudentFeedback };
};
