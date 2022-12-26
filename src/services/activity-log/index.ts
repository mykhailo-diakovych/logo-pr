import Api from "~/services/Api";
import { ServiceGetAll } from "~/types/crud";
import { FilterResponse } from "~/types/filters";
import { ActivityLog, ActivityLogFilters } from "~/types/activity-logs";

class ActivityLogService
  extends Api
  implements ServiceGetAll<ActivityLogFilters, FilterResponse<ActivityLog>>
{
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(filters: ActivityLogFilters) {
    const studentId = filters.studentId;
    Reflect.deleteProperty(filters, "studentId");

    const { data } = await this.get<FilterResponse<ActivityLog>>(studentId, {
      params: filters,
    });
    return data;
  }
}

export default new ActivityLogService("activity-logs");
