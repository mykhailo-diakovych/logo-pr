import { defineStore } from "pinia";
import { useFilters } from "#imports";
import ActivityLogService from "~/services/activity-log";
import { ActivityLog, ActivityLogFilters } from "~/types/activity-logs";

export const useActivityLogsStore = defineStore("Activity Logs", () => {
  const {
    filteredItems: activityLogs,
    loading: isLoadingActivityLogs,
    fetchFilteredItems: fetchActivityLogs,
    totalFilteredItems: totalActivityLogs,
  } = useFilters<ActivityLog, ActivityLogFilters>(ActivityLogService);

  return {
    activityLogs,
    totalActivityLogs,
    isLoadingActivityLogs,
    fetchActivityLogs,
  };
});
