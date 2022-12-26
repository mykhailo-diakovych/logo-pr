import { WeeklyUpdateSummary } from "~/types/weekly-updates";
import { TaskSummary } from "~/types/tasks";
import Tasks from "~/services/tasks";
import WeeklyUpdates from "~/services/weekly-updates";

export const useFetchStudentSummary = () => {
  const studentWeeklyUpdatesSummary = ref<WeeklyUpdateSummary>({
    total: 0,
    completed: 0,
  });

  const studentTasksSummary = ref<TaskSummary>({
    total: 0,
    approved: 0,
  });

  const studentWeeklyUpdatesSummaryDonePercent = computed(() => {
    const { total, completed } = studentWeeklyUpdatesSummary.value;
    return completed / (total / 100);
  });

  const studentTasksSummaryDonePercent = computed(() => {
    const { total, approved } = studentTasksSummary.value;
    return approved / (total / 100);
  });

  const fetchStudentSummary = async (studentId: string) => {
    studentTasksSummary.value = await Tasks.getSummary(studentId);
    studentWeeklyUpdatesSummary.value = await WeeklyUpdates.getSummary(
      studentId
    );
  };

  return {
    studentWeeklyUpdatesSummary,
    studentTasksSummary,
    studentTasksSummaryDonePercent,
    studentWeeklyUpdatesSummaryDonePercent,
    fetchStudentSummary,
  };
};
