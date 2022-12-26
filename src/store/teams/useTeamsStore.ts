import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import { useFilters } from "#imports";
import { CreateTeamDto, TeamUpdateStatusDto } from "~/types/teams";
import Teams from "~/services/teams";
import { useTeamStore } from "~/store/teams/useTeamStore";

export const useTeamsStore = defineStore("Teams", () => {
  const teamStore = useTeamStore();

  const {
    filteredItems: teams,
    loading: isLoadingTeams,
    fetchFilteredItems: fetchTeams,
    totalFilteredItems: totalTeams,
  } = useFilters(Teams, {
    page: 0,
  });

  const updateTeamStatus = async (id: string, payload: TeamUpdateStatusDto) => {
    await Teams.updateStatus(id, payload);

    notification.success({
      message: "You successfully update team status",
    });

    teamStore.team?.id === id && (await teamStore.fetchTeam(id));
  };

  const createTeam = async (payload: CreateTeamDto) => {
    await Teams.create(payload);
    notification.success({
      message: "You successfully create new team",
    });
    await fetchTeams();
  };

  const updateTeam = async (id: string, payload: CreateTeamDto) => {
    await Teams.update(id, payload);
    notification.success({
      message: "You successfully update team",
    });
    fetchTeams();
  };

  return {
    teams,
    totalTeams,
    isLoadingTeams,
    fetchTeams,
    createTeam,
    updateTeamStatus,
    updateTeam,
  };
});
