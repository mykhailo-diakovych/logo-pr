import Api from "~/services/Api";
import {
  CreateTeamDto,
  Team,
  TeamFilters,
  TeamResponse,
  TeamUpdateStatusDto,
} from "~/types/teams";
import { ServiceGetAll } from "~/types/crud";
import { FilterResponse } from "~/types/filters";

class TeamsService
  extends Api
  implements ServiceGetAll<TeamFilters, FilterResponse<Team>>
{
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(filters?: TeamFilters) {
    const { data: teams } = await this.get<FilterResponse<Team>>("");
    return teams;
  }

  async getOne(id: string) {
    const { data } = await this.get<TeamResponse>(id);
    return data;
  }

  async getDetails(id: string) {
    const { data } = await this.get<TeamResponse>(`${id}/details`);
    return data;
  }

  async updateStatus(id: string, payload: TeamUpdateStatusDto) {
    const { data } = await this.put(`${id}/status`, payload);
    return data;
  }

  async create(payload: CreateTeamDto) {
    const { data } = await this.post("", payload);
    return data;
  }

  async update(id: string, payload: CreateTeamDto) {
    const { data } = await this.put(id, payload);
    return data;
  }
}

export default new TeamsService("teams");
