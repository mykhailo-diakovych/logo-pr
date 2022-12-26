import Dashboard from "~/services/dashboard";
import { computed, onBeforeMount, ref } from "#imports";
import { MentorDashboard } from "~/types/dashboard";
import { getFullName } from "~/helpers/utils";

const defaultDashboardInfo = (): MentorDashboard => ({ studentSummaries: [] });

export const useFetchMentorDashboard = () => {
  const dashboardInfo = ref<MentorDashboard>(defaultDashboardInfo());
  const isLoading = ref(false);

  const mentorDashboardInfo = computed(() =>
    dashboardInfo.value.studentSummaries.map((studentSummary) => ({
      ...studentSummary,
      firstName: getFullName(studentSummary),
    }))
  );

  const fetchMentorDashboard = async () => {
    try {
      isLoading.value = true;
      dashboardInfo.value = await Dashboard.getMentorInfo();
    } catch (e) {
      dashboardInfo.value = defaultDashboardInfo();
    } finally {
      isLoading.value = false;
    }
  };

  onBeforeMount(fetchMentorDashboard);

  return { mentorDashboardInfo, isLoading };
};
