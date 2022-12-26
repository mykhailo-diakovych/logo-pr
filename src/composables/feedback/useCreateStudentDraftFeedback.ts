import { notification } from "ant-design-vue";
import { useToggle } from "#imports";
import Feedbacks from "~/services/feedbacks";
import { useFeedbackStore } from "~/store/feedbacks/useFeedbackStore";

export const useCreateStudentDraftFeedback = () => {
  const [isCreatingStudentFeedback, toggleCreatingStudentFeedback] =
    useToggle();

  const createStudentFeedback = async (studentId: string, feedback: string) => {
    toggleCreatingStudentFeedback(true);
    try {
      await Feedbacks.createDraft(studentId, feedback);

      notification.success({
        message: "You successfully create draft with feedback",
      });

      useFeedbackStore().fetchStudentFeedback(studentId);
    } catch {
    } finally {
      toggleCreatingStudentFeedback(false);
    }
  };

  return { isCreatingStudentFeedback, createStudentFeedback };
};
