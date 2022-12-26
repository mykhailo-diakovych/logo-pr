import Dashboard from "~/services/dashboard";
import { onBeforeMount, ref } from "#imports";
import { AdminDashboard } from "~/types/dashboard";

const defaultDashboardInfo = (): AdminDashboard => ({
  courseStatistics: {
    COMPLETED: 0,
    ACTIVE: 0,
    SCHEDULED: 0,
  },
  studentStatistics: {
    APPLIED: 0,
    GRADUATED: 0,
    ACTIVE: 0,
    REJECTED: 0,
  },
  userStatistics: {
    ROLE_MENTOR: 0,
    ROLE_ADMIN: 0,
  },
  teamStatistics: {
    ISSUES: 0,
    ON_TRACK: 0,
  },
  knowledgeResourceStatistics: {
    VIDEO: 0,
    ARTICLES: 0,
    BOOKS: 0,
  },
  projectStatistics: {
    DRAFT: 0,
    COMPLETED: 0,
    IN_PROGRESS: 0,
    PLANNED: 0,
  },
  academyTaskStatistics: {
    ONBOARDING: 0,
    APPLICATION: 0,
    ACTIVE: 0,
    FINAL: 0,
  },
});

export const useFetchAdminDashboard = () => {
  const dashboardInfo = ref<AdminDashboard>(defaultDashboardInfo());

  const fetchAdminDashboard = async () => {
    try {
      dashboardInfo.value = await Dashboard.getAdminInfo();
    } catch (e) {
      dashboardInfo.value = defaultDashboardInfo();
    }
  };

  onBeforeMount(fetchAdminDashboard);

  return { dashboardInfo };
};
