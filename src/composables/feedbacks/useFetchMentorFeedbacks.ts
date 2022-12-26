import { MentorFeedback } from "~/types/feedbacks";
import { computed, onBeforeMount, ref, useToggle } from "#imports";
import Feedbacks from "~/services/feedbacks";
import { formatDate } from "~/helpers/date";

export const useFetchMentorFeedbacks = (mentorId: string) => {
  const feedbacks = ref<MentorFeedback[]>([]);
  const [isFetchingMentorFeedbacks, toggleFetchingMentorFeedbacks] =
    useToggle();

  const mentorFeedbacks = computed(() =>
    feedbacks.value.map((mentorFeedback) => ({
      ...mentorFeedback,
      authorFirstName: `${mentorFeedback.authorFirstName} ${mentorFeedback.authorLastName}`,
      updatedAt: formatDate(mentorFeedback.updatedAt),
    }))
  );

  const fetchMentorFeedbacks = async () => {
    toggleFetchingMentorFeedbacks(true);
    try {
      feedbacks.value = await Feedbacks.getByMentorId(mentorId);
    } finally {
      toggleFetchingMentorFeedbacks(false);
    }
  };

  if (mentorId) onBeforeMount(fetchMentorFeedbacks);

  return { mentorFeedbacks, isFetchingMentorFeedbacks, fetchMentorFeedbacks };
};
