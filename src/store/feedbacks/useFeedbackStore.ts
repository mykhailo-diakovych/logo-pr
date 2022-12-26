import { defineStore } from "pinia";
import Feedbacks from "~/services/feedbacks";
import { useFetchStudentFeedback } from "~/composables/feedback/useFetchStudentFeedback";
import { useSubmitStudentFeedback } from "~/composables/feedback/useSubmitStudentFeedback";
import { useCreateStudentDraftFeedback } from "~/composables/feedback/useCreateStudentDraftFeedback";
import { useUpdateStudentFeedback } from "~/composables/feedback/useUpdateStudentFeedback";

export const useFeedbackStore = defineStore("Feedbacks", () => {
  const { fetchStudentFeedback, studentFeedback, isFetchingStudentFeedback } =
    useFetchStudentFeedback();

  const { submitStudentFeedback, isSubmittingStudentFeedback } =
    useSubmitStudentFeedback();

  const { createStudentFeedback, isCreatingStudentFeedback } =
    useCreateStudentDraftFeedback();

  const { updateStudentFeedback, isUpdatingStudentFeedback } =
    useUpdateStudentFeedback();

  const isNeedToUpdateFeedback = computed(
    () => studentFeedback.value?.feedbackStatus === "DRAFT"
  );
  const isFeedbackSubmitted = computed(
    () => studentFeedback.value?.feedbackStatus === "SUBMITTED"
  );

  return {
    studentFeedback,
    isFeedbackSubmitted,
    isNeedToUpdateFeedback,
    isFetchingStudentFeedback,
    isCreatingStudentFeedback,
    isUpdatingStudentFeedback,
    isSubmittingStudentFeedback,

    fetchStudentFeedback,
    submitStudentFeedback,
    createStudentFeedback,
    updateStudentFeedback,
  };
});
