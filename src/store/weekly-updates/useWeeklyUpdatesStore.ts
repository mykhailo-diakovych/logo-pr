import { defineStore } from "pinia";
import dayjs from "dayjs";
import { computed, useFilters } from "#imports";
import WeeklyUpdates from "~/services/weekly-updates";
import { WeeklyUpdate, WeeklyUpdatesFilters } from "~/types/weekly-updates";

export const useWeeklyUpdatesStore = defineStore("Weekly Updates", () => {
  const {
    filteredItems: weeklyUpdates,
    loading: isLoadingWeeklyUpdates,
    fetchFilteredItems: fetchWeeklyUpdates,
    totalFilteredItems: totalWeeklyUpdates,
  } = useFilters<WeeklyUpdate, WeeklyUpdatesFilters>(WeeklyUpdates);

  const parseWeeklyUpdateFirstOrLastDayOfWeek = (
    firstOrLastDayOfWeek: string
  ) => {
    return dayjs(firstOrLastDayOfWeek.replace("[UTC]", "")).format("DD/MM");
  };

  const weeklyUpdatesView = computed<WeeklyUpdate[]>(() =>
    weeklyUpdates.value.map((weeklyUpdate) => ({
      ...weeklyUpdate,
      firstDayOfWeek: `${parseWeeklyUpdateFirstOrLastDayOfWeek(
        weeklyUpdate.firstDayOfWeek
      )} - ${parseWeeklyUpdateFirstOrLastDayOfWeek(
        weeklyUpdate.lastDayOfWeek
      )}`,
      updateAt: dayjs(weeklyUpdate.updateAt).format("DD MMMM, YYYY"),
    }))
  );

  return {
    weeklyUpdates,
    weeklyUpdatesView,
    totalWeeklyUpdates,
    isLoadingWeeklyUpdates,
    fetchWeeklyUpdates,
  };
});
