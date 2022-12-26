import Api from "~/services/Api";
import { ServiceGetAll } from "~/types/crud";
import {
  WeeklyUpdate,
  WeeklyUpdatesFilters,
  WeeklyUpdateSummary,
} from "~/types/weekly-updates";
import { FilterResponse } from "~/types/filters";
import { TaskSummary } from "~/types/tasks";

class WeeklyUpdates
  extends Api
  implements ServiceGetAll<WeeklyUpdatesFilters, FilterResponse<WeeklyUpdate>>
{
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(filters?: WeeklyUpdatesFilters) {
    const { data } = await this.get<any>("", { params: filters });
    return data;
  }

  async getSummary(studentId: string) {
    const { data: weeklyUpdateSummary } = await this.get<WeeklyUpdateSummary>(
      "summary",
      {
        params: { studentId },
      }
    );
    return weeklyUpdateSummary;
  }
}

export default new WeeklyUpdates("weekly-updates");
